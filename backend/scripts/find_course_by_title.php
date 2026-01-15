<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use App\Models\Enrollment;

$q = $argv[1] ?? null;
if (! $q) {
    echo "Usage: php find_course_by_title.php <search-term>\n";
    exit(1);
}

$course = Course::where('title', 'like', "%{$q}%")->first();
if (! $course) {
    echo "Course not found for term: {$q}\n";
    exit;
}

echo "Course:\n" . json_encode($course->toArray(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
$enrs = Enrollment::where('course_id', $course->id)->with('user')->get()->toArray();
echo "Enrollments:\n" . json_encode($enrs, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
