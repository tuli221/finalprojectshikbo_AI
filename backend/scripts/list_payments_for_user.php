<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Payment;

$uid = $argv[1] ?? null;
if (! $uid) {
    echo "Usage: php list_payments_for_user.php <user_id>\n";
    exit(1);
}

$rows = Payment::where('user_id', $uid)->with('course')->orderBy('created_at','desc')->get()->toArray();
echo json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
