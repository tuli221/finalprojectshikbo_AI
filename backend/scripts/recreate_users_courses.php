<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Recreating users table...\n\n";

try {
    // Drop users table completely
    echo "Dropping users table...\n";
    DB::statement('DROP TABLE IF EXISTS users');
    echo "✓ Dropped\n\n";
    
    // Recreate users table with proper structure
    echo "Creating users table...\n";
    DB::statement("
        CREATE TABLE users (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'student', 'instructor') DEFAULT 'student',
            remember_token VARCHAR(100) NULL,
            otp_verified_at TIMESTAMP NULL,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL,
            KEY users_email_index (email)
        ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
    echo "✓ Created with InnoDB engine\n\n";
    
    echo "Recreating courses table...\n";
    DB::statement('DROP TABLE IF EXISTS courses');
    DB::statement("
        CREATE TABLE courses (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT NULL,
            instructor_id BIGINT UNSIGNED NULL,
            category VARCHAR(255) NULL,
            level VARCHAR(255) NULL,
            price DECIMAL(8,2) NULL,
            duration VARCHAR(255) NULL,
            thumbnail VARCHAR(255) NULL,
            created_at TIMESTAMP NULL,
            updated_at TIMESTAMP NULL,
            CONSTRAINT courses_instructor_id_foreign
                FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
    echo "✓ Courses table created\n\n";
    
    echo "✓✓✓ Tables recreated successfully!\n";
    echo "Now try running: php artisan migrate\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
