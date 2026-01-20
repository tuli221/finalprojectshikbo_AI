<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$migrations = [
    '2026_01_09_100000_create_programs_table.php',
    '2026_01_10_100000_create_bookings_table.php',
    '2026_01_11_000000_create_payments_table.php',
    '2026_01_11_000001_add_seats_to_programs_table.php',
    '2026_01_12_000001_create_enrollments_table.php',
    '2026_01_12_000002_add_unique_index_to_enrollments.php',
    '2026_01_18_213058_add_progress_to_enrollments_table.php'
];

echo "Running specific migrations to restore missing tables...\n\n";

foreach ($migrations as $migration) {
    $migrationPath = __DIR__ . '/../database/migrations/' . $migration;
    
    if (!file_exists($migrationPath)) {
        echo "⚠ Migration file not found: $migration\n";
        continue;
    }
    
    try {
        echo "Running: $migration\n";
        
        // Include the migration file
        $migrationInstance = include $migrationPath;
        
        // Run the up() method
        $migrationInstance->up();
        
        // Record in migrations table
        DB::table('migrations')->insert([
            'migration' => str_replace('.php', '', $migration),
            'batch' => DB::table('migrations')->max('batch') + 1
        ]);
        
        echo "  ✓ Success\n\n";
    } catch (Exception $e) {
        echo "  ✗ Error: " . $e->getMessage() . "\n\n";
    }
}

echo "Migration restore complete!\n";
