<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

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

echo "Checking database tables...\n\n";

$existingTables = DB::select('SHOW TABLES');
$tableList = array_map(function($table) {
    return current((array)$table);
}, $existingTables);

echo "Existing tables:\n";
foreach ($tableList as $table) {
    echo "  ✓ $table\n";
}

echo "\n\nMissing tables:\n";
$missingTables = array_diff($expectedTables, $tableList);
if (empty($missingTables)) {
    echo "  None - all tables exist!\n";
} else {
    foreach ($missingTables as $table) {
        echo "  ✗ $table\n";
    }
}
