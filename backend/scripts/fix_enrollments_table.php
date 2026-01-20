<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "Checking if enrollments table exists...\n";
    
    // Drop enrollments table if exists
    DB::statement('DROP TABLE IF EXISTS enrollments');
    echo "Dropped existing enrollments table (if any)\n\n";
    
    // Create enrollments table with proper structure
    echo "Creating enrollments table...\n";
    DB::statement("
        CREATE TABLE enrollments (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id BIGINT UNSIGNED NOT NULL,
            course_id BIGINT UNSIGNED NOT NULL,
            payment_id BIGINT UNSIGNED NULL,
            enrolled_at TIMESTAMP NULL,
            status VARCHAR(255) DEFAULT 'active',
            progress INT DEFAULT 0,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL,
            CONSTRAINT enrollments_user_id_foreign 
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT enrollments_course_id_foreign 
                FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
            CONSTRAINT enrollments_payment_id_foreign 
                FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
    
    echo "Enrollments table created successfully!\n\n";
    
    // Add unique index
    echo "Adding unique index...\n";
    DB::statement('CREATE UNIQUE INDEX enrollments_user_id_course_id_unique ON enrollments(user_id, course_id)');
    echo "Unique index created successfully!\n\n";
    
    // Update migrations table
    $batch = DB::table('migrations')->max('batch') + 1;
    DB::table('migrations')->insert([
        ['migration' => '2026_01_12_000001_create_enrollments_table', 'batch' => $batch]
    ]);
    
    echo "✓ All done! Enrollments table has been restored.\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
