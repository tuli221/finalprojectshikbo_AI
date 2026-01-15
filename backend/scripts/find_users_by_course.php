<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$cid = $argv[1] ?? null;
if (! $cid) {
    echo "Usage: php find_users_by_course.php <course_id>\n";
    exit(1);
}

$users = User::where('course_id', $cid)->get()->toArray();
echo json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
