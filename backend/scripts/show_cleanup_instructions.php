<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "════════════════════════════════════════════════════════\n";
echo "       REMOVE ORPHANED TABLESPACE FILES                \n";
echo "════════════════════════════════════════════════════════\n\n";

$database = env('DB_DATABASE');
$problematicTables = [
    'users',
    'courses',
    'instructors',
    'otps',
    'instructor_requests',
    'student_profiles',
    'course_user',
    'course_information'
];

echo "This script will guide you to manually clean orphaned tablespace files.\n\n";

echo "MANUAL STEPS REQUIRED:\n";
echo str_repeat('-', 56) . "\n";
echo "1. Find your MySQL/MariaDB data directory\n";
echo "   Common locations:\n";
echo "   - C:\\xampp\\mysql\\data\\$database\\\n";
echo "   - C:\\wamp64\\bin\\mysql\\mysql[version]\\data\\$database\\\n";
echo "   - C:\\laragon\\bin\\mysql\\mysql-[version]-winx64\\data\\$database\\\n\n";

echo "2. Stop MySQL/MariaDB service\n\n";

echo "3. Delete these files from the data directory:\n";
foreach ($problematicTables as $table) {
    echo "   - $table.ibd\n";
    echo "   - $table.frm (if exists)\n";
}

echo "\n4. Restart MySQL/MariaDB service\n\n";

echo "5. Run this command:\n";
echo "   cd e:\\finalproject\\backend\n";
echo "   php artisan migrate:fresh --force\n\n";

echo "════════════════════════════════════════════════════════\n\n";

// Try to show actual data directory location
try {
    $datadir = DB::select("SHOW VARIABLES LIKE 'datadir'");
    if (!empty($datadir)) {
        $path = $datadir[0]->Value;
        echo "Your MySQL data directory is:\n";
        echo "  " . $path . $database . "\\\n\n";
        
        echo "Files to delete:\n";
        foreach ($problematicTables as $table) {
            echo "  " . $path . $database . "\\$table.ibd\n";
        }
    }
} catch (Exception $e) {
    echo "Could not determine data directory location.\n";
}

echo "\n\nOR USE THIS AUTOMATED POWERSH script:\n";
echo str_repeat('=', 56) . "\n";

$script = <<<'POWERSHELL'
# Stop MySQL service (adjust service name if needed)
Stop-Service MySQL -ErrorAction SilentlyContinue
Stop-Service MariaDB -ErrorAction SilentlyContinue

# Wait a moment
Start-Sleep -Seconds 2

# Find and delete orphaned tablespace files
$tables = @('users', 'courses', 'instructors', 'otps', 'instructor_requests', 'student_profiles', 'course_user', 'course_information')
$dataDirs = @(
    "C:\xampp\mysql\data\finalshikboai",
    "C:\wamp64\bin\mysql\mysql*\data\finalshikboai",
    "C:\laragon\bin\mysql\mysql*\data\finalshikboai"
)

foreach ($dir in $dataDirs) {
    if (Test-Path $dir) {
        Write-Host "Found data directory: $dir"
        foreach ($table in $tables) {
            $ibdFile = Join-Path $dir "$table.ibd"
            $frmFile = Join-Path $dir "$table.frm"
            
            if (Test-Path $ibdFile) {
                Remove-Item $ibdFile -Force
                Write-Host "Deleted: $ibdFile"
            }
            if (Test-Path $frmFile) {
                Remove-Item $frmFile -Force
                Write-Host "Deleted: $frmFile"
            }
        }
    }
}

# Start MySQL service
Start-Service MySQL -ErrorAction SilentlyContinue
Start-Service MariaDB -ErrorAction SilentlyContinue

Write-Host "`nServices restarted. Now run: php artisan migrate:fresh --force"
POWERSHELL;

echo $script;
echo "\n" . str_repeat('=', 56) . "\n";

echo "\nSave the above script as 'clean_mysql.ps1' and run as Administrator.\n";
