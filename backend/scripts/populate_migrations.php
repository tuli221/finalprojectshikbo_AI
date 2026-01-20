<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Populating migrations table with existing migrations...\n\n";

// Clear existing migrations
DB::table('migrations')->truncate();

// List of all migrations that have been run (tables that exist)
$migrations = [
    '2014_10_12_100000_create_password_reset_tokens_table',
    '2019_08_19_000000_create_failed_jobs_table',
    '2019_12_14_000001_create_personal_access_tokens_table',
    '2025_12_14_071637_create_users_table',
    '2025_12_17_062149_create_courses_table',
    '2025_12_21_060557_create_instructors_table',
    '2025_12_25_153000_add_instructor_id_to_courses_table',
    '2025_12_25_154500_make_instructor_column_nullable_or_add',
    '2025_12_28_000001_update_instructors_table_add_fields',
    '2025_12_29_120000_add_student_fields_to_users_table',
    '2025_12_30_155917_create_otps_table',
    '2025_12_30_160500_add_user_optional_fields',
    '2026_01_02_000000_create_instructor_requests_table',
    '2026_01_02_000001_add_user_id_to_instructors_table',
    '2026_01_05_000000_create_student_profiles_table',
    '2026_01_05_000001_create_course_user_table',
    '2026_01_07_074807_create_course_information_table',
    '2026_01_09_100000_create_programs_table',
    '2026_01_10_100000_create_bookings_table',
    '2026_01_11_000000_create_payments_table',
    '2026_01_11_000001_add_seats_to_programs_table',
];

$batch = 1;
foreach ($migrations as $migration) {
    DB::table('migrations')->insert([
        'migration' => $migration,
        'batch' => $batch
    ]);
    echo "✓ $migration\n";
}

echo "\n✓ Migrations table populated!\n";
echo "Now running remaining migrations...\n\n";
