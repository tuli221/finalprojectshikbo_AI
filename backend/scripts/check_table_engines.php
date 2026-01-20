<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Checking table structures and engines...\n\n";

$tables = ['users', 'courses', 'payments'];

foreach ($tables as $table) {
    try {
        echo "Table: $table\n";
        echo str_repeat('-', 60) . "\n";
        
        // Get table status
        $status = DB::select("SHOW TABLE STATUS LIKE '$table'");
        if (!empty($status)) {
            $info = $status[0];
            echo "Engine: " . ($info->Engine ?? 'N/A') . "\n";
            echo "Collation: " . ($info->Collation ?? 'N/A') . "\n";
        }
        
        // Get columns
        $columns = DB::select("SHOW COLUMNS FROM $table");
        foreach ($columns as $column) {
            if ($column->Key === 'PRI') {
                echo sprintf("  PRIMARY KEY: %s (%s)\n", 
                    $column->Field, 
                    $column->Type
                );
            }
        }
        echo "\n";
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n\n";
    }
}
