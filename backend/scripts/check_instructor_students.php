<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use App\Models\Enrollment;

$instr = $argv[1] ?? null;
if (! $instr) {
    echo "Usage: php check_instructor_students.php <instructor_user_id>\n";
    exit(1);
}

$courseIds = Course::where('instructor_id', $instr)->pluck('id')->toArray();
echo "Courses for instructor {$instr}: " . json_encode($courseIds) . "\n";

$en = Enrollment::whereIn('course_id', $courseIds)->with(['course','user'])->get()->toArray();
echo json_encode($en, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
