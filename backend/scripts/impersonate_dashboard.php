<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\StudentController;

$userId = $argv[1] ?? null;
if (! $userId) {
    echo "Usage: php impersonate_dashboard.php <user_id>\n";
    exit(1);
}

use App\Models\User;

$controller = new StudentController();
$req = Request::create('/dummy', 'GET');
$req->setUserResolver(function () use ($userId) { return User::find($userId); });
$resp = $controller->dashboard($req);

// If response is JsonResponse, get data
if (method_exists($resp, 'getData')) {
    $data = $resp->getData(true);
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} else {
    echo (string) $resp;
}
