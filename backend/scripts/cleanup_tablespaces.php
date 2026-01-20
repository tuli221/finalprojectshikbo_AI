<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Cleaning up and recreating corrupted tables...\n\n";

try {
    $corruptedTables = ['users', 'courses', 'instructors', 'student_profiles', 
                        'course_information', 'course_user', 'instructor_requests',
                        'otps', 'personal_access_tokens', 'failed_jobs', 'password_reset_tokens'];
    
    foreach ($corruptedTables as $table) {
        echo "Processing $table...\n";
        
        try {
            // First, try to discard the tablespace
            DB::statement("ALTER TABLE `$table` DISCARD TABLESPACE");
            echo "  - Discarded tablespace\n";
        } catch (Exception $e) {
            // Ignore if it fails
        }
        
        try {
            // Drop the table
            DB::statement("DROP TABLE IF EXISTS `$table`");
            echo "  - Dropped table\n";
        } catch (Exception $e) {
            echo "  - Drop failed: " . substr($e->getMessage(), 0, 50) . "...\n";
        }
    }
    
    echo "\n✓ Cleanup complete!\n";
    echo "\nNow running migrations to recreate all tables...\n\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
