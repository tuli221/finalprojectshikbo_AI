<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Converting tables to InnoDB engine...\n\n";

$tables = [
    'users',
    'courses', 
    'payments',
    'programs',
    'bookings',
    'instructors',
    'student_profiles',
    'course_information',
    'course_user',
    'instructor_requests',
    'otps',
    'personal_access_tokens',
    'failed_jobs',
    'password_reset_tokens',
    'migrations'
];

foreach ($tables as $table) {
    try {
        echo "Converting $table...";
        DB::statement("ALTER TABLE `$table` ENGINE=InnoDB");
        echo " ✓\n";
    } catch (Exception $e) {
        echo " ✗ Error: " . $e->getMessage() . "\n";
    }
}

echo "\nAll tables converted to InnoDB!\n";
echo "\nNow creating enrollments table...\n";

try {
    // Drop if exists
    DB::statement('DROP TABLE IF EXISTS enrollments');
    
    // Create enrollments table
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
                FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
            UNIQUE KEY enrollments_user_id_course_id_unique (user_id, course_id)
        ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    ");
    
    echo "✓ Enrollments table created successfully!\n\n";
    
    // Update migrations table
    $existingMigration = DB::table('migrations')
        ->where('migration', '2026_01_12_000001_create_enrollments_table')
        ->first();
    
    if (!$existingMigration) {
        $batch = DB::table('migrations')->max('batch') + 1;
        DB::table('migrations')->insert([
            ['migration' => '2026_01_12_000001_create_enrollments_table', 'batch' => $batch],
            ['migration' => '2026_01_12_000002_add_unique_index_to_enrollments', 'batch' => $batch],
            ['migration' => '2026_01_18_213058_add_progress_to_enrollments_table', 'batch' => $batch]
        ]);
    }
    
    echo "✓✓✓ ALL TABLES SUCCESSFULLY RESTORED! ✓✓✓\n";
    
} catch (Exception $e) {
    echo "Error creating enrollments: " . $e->getMessage() . "\n";
}
