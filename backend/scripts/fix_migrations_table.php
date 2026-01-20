<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "Dropping migrations table if exists...\n";
    DB::statement('DROP TABLE IF EXISTS migrations');
    
    echo "Creating migrations table with InnoDB engine...\n";
    DB::statement('CREATE TABLE migrations (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        migration VARCHAR(255) NOT NULL,
        batch INT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    
    echo "Migrations table created successfully!\n";
    echo "Now you can run: php artisan migrate\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
