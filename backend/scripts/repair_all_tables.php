<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Repairing and converting all tables...\n\n";

// Get all tables
$tables = DB::select('SHOW TABLES');
$tableList = array_map(function($table) {
    return current((array)$table);
}, $tables);

foreach ($tableList as $table) {
    echo "Processing $table...\n";
    
    try {
        // Try to repair the table
        DB::statement("REPAIR TABLE `$table`");
        echo "  - Repaired\n";
    } catch (Exception $e) {
        echo "  - Repair skipped: " . substr($e->getMessage(), 0, 60) . "...\n";
    }
    
    try {
        // Try to convert to InnoDB
        DB::statement("ALTER TABLE `$table` ENGINE=InnoDB");
        echo "  - Converted to InnoDB ✓\n";
    } catch (Exception $e) {
        echo "  - Already InnoDB or error\n";
    }
    
    echo "\n";
}

echo "\nAll tables processed!\n";
