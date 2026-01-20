<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$tables = ['users', 'courses', 'payments'];

foreach ($tables as $table) {
    echo "Table: $table\n";
    echo str_repeat('-', 50) . "\n";
    
    $columns = DB::select("SHOW COLUMNS FROM $table");
    foreach ($columns as $column) {
        echo sprintf("  %s: %s %s\n", 
            $column->Field, 
            $column->Type,
            $column->Key ? "[$column->Key]" : ""
        );
    }
    echo "\n";
}
