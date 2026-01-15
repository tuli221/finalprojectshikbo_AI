<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;

$instr = $argv[1] ?? null;
if (! $instr) {
    echo "Usage: php get_instructor_students.php <instructor_user_id>\n";
    exit(1);
}

$courseIds = Course::where('instructor_id', $instr)->pluck('id')->toArray();

$results = [];
try {
    $enrollments = Enrollment::whereIn('course_id', $courseIds)->with(['user','course'])->orderBy('enrolled_at','desc')->get();
    foreach ($enrollments as $en) {
        $u = $en->user;
        if (! $u) continue;
        $results[$u->id] = [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role,
            'course' => $en->course ? $en->course->only(['id','title']) : null,
            'enrollment_date' => $en->enrolled_at ? $en->enrolled_at->toDateString() : ($u->enrollment_date ? $u->enrollment_date : null),
        ];
    }
} catch (\Exception $e) {}

try {
    $legacy = User::where('role','student')->whereIn('course_id', $courseIds)->with('course')->get();
    foreach ($legacy as $u) {
        if (isset($results[$u->id])) continue;
        $results[$u->id] = [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role,
            'course' => $u->course ? $u->course->only(['id','title']) : null,
            'enrollment_date' => $u->enrollment_date ? $u->enrollment_date : null,
        ];
    }
} catch (\Exception $e) {}

echo json_encode(array_values($results), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
