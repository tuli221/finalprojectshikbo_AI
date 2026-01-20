<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "════════════════════════════════════════════════════════\n";
echo "        FINAL DATABASE FIX & TABLE RESTORATION          \n";
echo "════════════════════════════════════════════════════════\n\n";

try {
    // Step 1: Get database name
    $database = env('DB_DATABASE');
    echo "Database: $database\n\n";
    
    // Step 2: Drop the entire database and recreate it
    echo "Step 1: Dropping and recreating database...\n";
    DB::statement("DROP DATABASE IF EXISTS `$database`");
    echo "  ✓ Database dropped\n";
    
    DB::statement("CREATE DATABASE `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "  ✓ Database recreated\n";
    
    DB::statement("USE `$database`");
    echo "  ✓ Database selected\n\n";
    
    // Step 3: Create migrations table
    echo "Step 2: Creating migrations table...\n";
    DB::statement("
        CREATE TABLE migrations (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            migration VARCHAR(255) NOT NULL,
            batch INT NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
    echo "  ✓ Migrations table created\n\n";
    
    // Step 4: Run migrations via artisan
    echo "Step 3: Running all migrations...\n";
    echo str_repeat('-', 56) . "\n";
    
    $output = [];
    $returnVar = 0;
    exec('cd ' . escapeshellarg(__DIR__ . '/../') . ' && php artisan migrate --force 2>&1', $output, $returnVar);
    
    foreach ($output as $line) {
        echo $line . "\n";
    }
    
    echo "\n";
    
    // Step 5: Verify tables
    echo "Step 4: Verifying all tables...\n";
    echo str_repeat('-', 56) . "\n";
    
    $tables = DB::select('SHOW TABLES');
    $tableList = array_map(function($table) {
        return current((array)$table);
    }, $tables);
    
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
    
    echo "\n";
    $allPresent = true;
    foreach ($expectedTables as $table) {
        if (in_array($table, $tableList)) {
            echo "  ✓ $table\n";
        } else {
            echo "  ✗ $table - MISSING\n";
            $allPresent = false;
        }
    }
    
    echo "\n";
    echo "════════════════════════════════════════════════════════\n";
    if ($allPresent) {
        echo "   ✓✓✓ ALL TABLES SUCCESSFULLY CREATED! ✓✓✓          \n";
    } else {
        echo "   ⚠ SOME TABLES ARE STILL MISSING ⚠                \n";
    }
    echo "════════════════════════════════════════════════════════\n";
    echo "\nTotal tables: " . count($tableList) . "/" . count($expectedTables) . "\n";
    
} catch (Exception $e) {
    echo "\n✗ ERROR: " . $e->getMessage() . "\n";
}
