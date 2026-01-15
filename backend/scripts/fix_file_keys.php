<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\CourseInformation;

echo "Fixing file_key entries in course information...\n";

$courseInfo = CourseInformation::find(4);

if (!$courseInfo) {
    echo "Course information not found!\n";
    exit(1);
}

$modules = json_decode($courseInfo->modules, true);

foreach ($modules as &$module) {
    if (isset($module['lessons'])) {
        foreach ($module['lessons'] as &$lesson) {
            if (isset($lesson['file_key'])) {
                echo "Removing file_key: {$lesson['file_key']}\n";
                unset($lesson['file_key']);
            }
        }
    }
}

$courseInfo->modules = json_encode($modules);
$courseInfo->save();

echo "Done! file_key entries removed.\n";
echo "Please re-upload the lesson files from the admin interface.\n";
