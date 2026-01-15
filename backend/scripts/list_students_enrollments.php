<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Enrollment;

$students = User::where('role', 'student')->get();
$out = [];
foreach ($students as $s) {
    $count = 0;
    try {
        $count = Enrollment::where('user_id', $s->id)->count();
    } catch (Throwable $e) {
        $count = 0;
    }
    $out[] = [
        'id' => $s->id,
        'name' => $s->name,
        'email' => $s->email,
        'legacy_course_id' => $s->course_id,
        'enrollments_count' => $count,
    ];
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
