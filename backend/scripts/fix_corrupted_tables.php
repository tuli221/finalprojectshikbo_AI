<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Fixing corrupted tables...\n\n";

$corruptedTables = [
    'users',
    'courses',
    'instructors',
    'student_profiles',
    'course_information',
    'course_user',
    'instructor_requests',
    'otps',
    'personal_access_tokens',
    'failed_jobs',
    'password_reset_tokens'
];

foreach ($corruptedTables as $table) {
    try {
        echo "Fixing $table...\n";
        
        // Try to backup data first
        try {
            $data = DB::table($table)->get();
            $dataCount = count($data);
            echo "  - Found $dataCount records to preserve\n";
            
            // Create a temporary table name
            $tempTable = $table . '_backup_' . time();
            
            // Rename the corrupted table
            DB::statement("RENAME TABLE `$table` TO `$tempTable`");
            echo "  - Renamed to backup table\n";
            
        } catch (Exception $e) {
            echo "  - Could not backup (table may not have data or be inaccessible)\n";
        }
        
        // Get the migration file for this table
        $migrationFile = null;
        $migrationsDir = __DIR__ . '/../database/migrations/';
        $files = scandir($migrationsDir);
        
        foreach ($files as $file) {
            if (stripos($file, 'create_' . $table . '_table') !== false ||
                stripos($file, '_' . $table . '_') !== false) {
                $migrationFile = $migrationsDir . $file;
                break;
            }
        }
        
        if ($migrationFile && file_exists($migrationFile)) {
            echo "  - Found migration: " . basename($migrationFile) . "\n";
            
            // Include and run the migration
            $migration = include $migrationFile;
            
            try {
                $migration->up();
                echo "  ✓ Table recreated successfully\n";
                
                // Try to restore data if we have a backup
                if (isset($tempTable)) {
                    try {
                        DB::statement("INSERT INTO `$table` SELECT * FROM `$tempTable`");
                        echo "  ✓ Data restored\n";
                        DB::statement("DROP TABLE `$tempTable`");
                        echo "  ✓ Backup table removed\n";
                    } catch (Exception $e) {
                        echo "  - Could not restore data (schema may have changed)\n";
                    }
                }
                
            } catch (Exception $e) {
                $errorMsg = $e->getMessage();
                if (strpos($errorMsg, 'already exists') !== false) {
                    echo "  - Table already exists\n";
                } else {
                    echo "  ✗ Error creating table: " . substr($errorMsg, 0, 80) . "...\n";
                }
            }
        } else {
            echo "  - Migration file not found\n";
        }
        
        echo "\n";
        
    } catch (Exception $e) {
        echo "  ✗ Error: " . substr($e->getMessage(), 0, 80) . "...\n\n";
    }
}

echo "Table repair complete!\n";
