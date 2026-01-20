<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "════════════════════════════════════════════════════════\n";
echo "      CLEAN DATABASE & RECREATE ALL TABLES             \n";
echo "════════════════════════════════════════════════════════\n\n";

try {
    DB::statement('SET FOREIGN_KEY_CHECKS=0');
    
    // Step 1: Get all existing tables
    echo "Step 1: Getting all existing tables...\n";
    $tables = DB::select('SHOW TABLES');
    $tableList = array_map(function($table) {
        return current((array)$table);
    }, $tables);
    
    echo "Found " . count($tableList) . " tables\n\n";
    
    // Step 2: Drop all tables including corrupted ones
    echo "Step 2: Dropping all tables (including corrupted)...\n";
    foreach ($tableList as $table) {
        try {
            DB::statement("DROP TABLE IF EXISTS `$table`");
            echo "  ✓ Dropped: $table\n";
        } catch (Exception $e) {
            echo "  ! Trying force drop: $table\n";
            try {
                // Try to remove .ibd files reference
                DB::statement("ALTER TABLE `$table` DISCARD TABLESPACE");
            } catch (Exception $e2) {}
            try {
                DB::statement("DROP TABLE IF EXISTS `$table`");
                echo "  ✓ Force dropped: $table\n";
            } catch (Exception $e3) {
                echo "  ✗ Could not drop: $table\n";
            }
        }
    }
    
    DB::statement('SET FOREIGN_KEY_CHECKS=1');
    
    echo "\nStep 3: Creating migrations table...\n";
    DB::statement("
        CREATE TABLE IF NOT EXISTS migrations (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL,
            batch INT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
    echo "  ✓ Migrations table created\n\n";
    
    // Step 4: Manually create all tables from migrations
    echo "Step 4: Creating all tables from migrations...\n";
    echo str_repeat('-', 56) . "\n";
    
    $migrationsDir = __DIR__ . '/../database/migrations/';
    $migrationFiles = scandir($migrationsDir);
    $migrationFiles = array_filter($migrationFiles, function($file) {
        return pathinfo($file, PATHINFO_EXTENSION) === 'php';
    });
    sort($migrationFiles);
    
    $batch = 1;
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($migrationFiles as $file) {
        $migrationName = str_replace('.php', '', $file);
        echo "\n" . $migrationName . "\n";
        
        try {
            $migration = include $migrationsDir . $file;
            $migration->up();
            
            // Record in migrations table
            DB::table('migrations')->insert([
                'migration' => $migrationName,
                'batch' => $batch
            ]);
            
            echo "  ✓ Success\n";
            $successCount++;
            
        } catch (Exception $e) {
            $errorMsg = $e->getMessage();
            if (strpos($errorMsg, 'already exists') !== false) {
                echo "  - Already exists (skipped)\n";
                // Still record it
                try {
                    DB::table('migrations')->insert([
                        'migration' => $migrationName,
                        'batch' => $batch
                    ]);
                } catch (Exception $e2) {}
            } else {
                echo "  ✗ Error: " . substr($errorMsg, 0, 80) . "...\n";
                $errorCount++;
            }
        }
    }
    
    // Step 5: Final verification
    echo "\n\nStep 5: Final verification...\n";
    echo str_repeat('=', 56) . "\n";
    
    $finalTables = DB::select('SHOW TABLES');
    $finalTableList = array_map(function($table) {
        return current((array)$table);
    }, $finalTables);
    
    $expectedTables = [
        'migrations' => 'System',
        'password_reset_tokens' => 'System',
        'failed_jobs' => 'System',
        'personal_access_tokens' => 'System',
        'users' => 'Core',
        'courses' => 'Core',
        'instructors' => 'Core',
        'otps' => 'Auth',
        'instructor_requests' => 'Core',
        'student_profiles' => 'Core',
        'course_user' => 'Pivot',
        'course_information' => 'Content',
        'programs' => 'Core',
        'bookings' => 'Business',
        'payments' => 'Business',
        'enrollments' => 'Core'
    ];
    
    echo "\nTable Status:\n";
    $presentCount = 0;
    $missingCount = 0;
    
    foreach ($expectedTables as $table => $category) {
        if (in_array($table, $finalTableList)) {
            echo "  ✓ $table [$category]\n";
            $presentCount++;
        } else {
            echo "  ✗ $table [$category] - MISSING!\n";
            $missingCount++;
        }
    }
    
    echo "\n";
    echo "════════════════════════════════════════════════════════\n";
    echo "  Migrations Run: $successCount successful, $errorCount errors\n";
    echo "  Tables: $presentCount/" . count($expectedTables) . " present\n";
    
    if ($missingCount == 0) {
        echo "\n  ✓✓✓ ALL TABLES SUCCESSFULLY CREATED! ✓✓✓\n";
    } else {
        echo "\n  ⚠ $missingCount tables still missing\n";
    }
    echo "════════════════════════════════════════════════════════\n";
    
} catch (Exception $e) {
    echo "\n✗ FATAL ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
