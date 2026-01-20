<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║     COMPLETE DATABASE REPAIR & MIGRATION SCRIPT            ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

try {
    // Step 1: Check current state
    echo "Step 1: Checking current database state...\n";
    echo str_repeat('-', 60) . "\n";
    
    $existingTables = DB::select('SHOW TABLES');
    $tableList = array_map(function($table) {
        return current((array)$table);
    }, $existingTables);
    
    echo "Found " . count($tableList) . " tables: " . implode(', ', $tableList) . "\n\n";
    
    // Step 2: Drop all tables to start fresh
    echo "Step 2: Dropping all existing tables...\n";
    echo str_repeat('-', 60) . "\n";
    
    DB::statement('SET FOREIGN_KEY_CHECKS=0');
    
    foreach ($tableList as $table) {
        try {
            DB::statement("DROP TABLE IF EXISTS `$table`");
            echo "  ✓ Dropped: $table\n";
        } catch (Exception $e) {
            echo "  ✗ Error dropping $table: " . $e->getMessage() . "\n";
        }
    }
    
    DB::statement('SET FOREIGN_KEY_CHECKS=1');
    echo "\n";
    
    // Step 3: Recreate migrations table
    echo "Step 3: Creating migrations table...\n";
    echo str_repeat('-', 60) . "\n";
    
    DB::statement("
        CREATE TABLE migrations (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL,
            batch INT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
    echo "  ✓ Migrations table created\n\n";
    
    // Step 4: Run migrations
    echo "Step 4: Running all migrations...\n";
    echo str_repeat('-', 60) . "\n";
    echo "Please wait...\n\n";
    
    // Execute artisan migrate
    $output = [];
    $returnVar = 0;
    exec('cd ' . __DIR__ . '/../ && php artisan migrate --force 2>&1', $output, $returnVar);
    
    foreach ($output as $line) {
        echo $line . "\n";
    }
    
    if ($returnVar === 0) {
        echo "\n✓ Migrations completed successfully!\n\n";
    } else {
        echo "\n✗ Migration encountered errors. Trying manual migration...\n\n";
        
        // Manual migration as fallback
        $migrationsDir = __DIR__ . '/../database/migrations/';
        $migrationFiles = scandir($migrationsDir);
        $migrationFiles = array_filter($migrationFiles, function($file) {
            return pathinfo($file, PATHINFO_EXTENSION) === 'php';
        });
        sort($migrationFiles);
        
        $batch = 1;
        foreach ($migrationFiles as $file) {
            echo "Running: $file\n";
            try {
                $migration = include $migrationsDir . $file;
                $migration->up();
                
                DB::table('migrations')->insert([
                    'migration' => str_replace('.php', '', $file),
                    'batch' => $batch
                ]);
                
                echo "  ✓ Success\n";
            } catch (Exception $e) {
                echo "  ✗ Error: " . $e->getMessage() . "\n";
            }
        }
    }
    
    // Step 5: Verify all tables
    echo "\nStep 5: Verifying created tables...\n";
    echo str_repeat('-', 60) . "\n";
    
    $finalTables = DB::select('SHOW TABLES');
    $finalTableList = array_map(function($table) {
        return current((array)$table);
    }, $finalTables);
    
    $expectedTables = [
        'migrations',
        'password_reset_tokens',
        'failed_jobs',
        'personal_access_tokens',
        'users',
        'courses',
        'instructors',
        'otps',
        'instructor_requests',
        'student_profiles',
        'course_user',
        'course_information',
        'programs',
        'bookings',
        'payments',
        'enrollments'
    ];
    
    echo "\nTable Status:\n";
    foreach ($expectedTables as $table) {
        if (in_array($table, $finalTableList)) {
            // Check engine
            $status = DB::select("SHOW TABLE STATUS LIKE '$table'");
            $engine = !empty($status) ? $status[0]->Engine : 'Unknown';
            echo "  ✓ $table (Engine: $engine)\n";
        } else {
            echo "  ✗ $table - MISSING!\n";
        }
    }
    
    echo "\n";
    echo "╔════════════════════════════════════════════════════════════╗\n";
    echo "║              DATABASE RESTORATION COMPLETE                 ║\n";
    echo "╚════════════════════════════════════════════════════════════╝\n";
    echo "\nTotal tables created: " . count($finalTableList) . "\n";
    
} catch (Exception $e) {
    echo "\n✗✗✗ FATAL ERROR ✗✗✗\n";
    echo $e->getMessage() . "\n";
    echo "\nStack trace:\n";
    echo $e->getTraceAsString() . "\n";
}
