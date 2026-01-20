<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

$backupDir = __DIR__ . '/../storage/backups';
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

$timestamp = date('Y-m-d_H-i-s');
$backupFile = $backupDir . '/database_backup_' . $timestamp . '.sql';

echo "Starting database backup...\n";
echo "Backup file: $backupFile\n\n";

$sql = "-- Database Backup\n";
$sql .= "-- Generated: " . date('Y-m-d H:i:s') . "\n";
$sql .= "-- Database: " . env('DB_DATABASE') . "\n\n";

$sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

try {
    // Get all tables
    $tables = DB::select('SHOW TABLES');
    $tableList = array_map(function($table) {
        return current((array)$table);
    }, $tables);

    echo "Found " . count($tableList) . " tables to backup\n\n";

    foreach ($tableList as $table) {
        echo "Backing up table: $table...";
        
        try {
            // Get table structure
            $createTable = DB::select("SHOW CREATE TABLE `$table`");
            if (!empty($createTable)) {
                $sql .= "-- Table: $table\n";
                $sql .= "DROP TABLE IF EXISTS `$table`;\n";
                $sql .= $createTable[0]->{'Create Table'} . ";\n\n";
            }

            // Get table data
            $rows = DB::table($table)->get();
            $rowCount = count($rows);
            
            if ($rowCount > 0) {
                $sql .= "-- Data for table: $table ($rowCount rows)\n";
                
                foreach ($rows as $row) {
                    $row = (array)$row;
                    $columns = array_keys($row);
                    $values = array_values($row);
                    
                    // Escape values
                    $values = array_map(function($value) {
                        if (is_null($value)) {
                            return 'NULL';
                        }
                        return "'" . addslashes($value) . "'";
                    }, $values);
                    
                    $sql .= "INSERT INTO `$table` (`" . implode('`, `', $columns) . "`) VALUES (" . implode(', ', $values) . ");\n";
                }
                $sql .= "\n";
            }
            
            echo " ✓ ($rowCount rows)\n";
            
        } catch (Exception $e) {
            echo " ✗ Error: " . $e->getMessage() . "\n";
        }
    }

    $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

    // Save to file
    file_put_contents($backupFile, $sql);
    
    $fileSize = filesize($backupFile);
    $fileSizeKB = round($fileSize / 1024, 2);
    
    echo "\n✓✓✓ Backup completed successfully! ✓✓✓\n";
    echo "File: $backupFile\n";
    echo "Size: $fileSizeKB KB\n";
    
    // Also create a JSON backup
    $jsonBackupFile = $backupDir . '/database_backup_' . $timestamp . '.json';
    $jsonData = [];
    
    foreach ($tableList as $table) {
        try {
            $rows = DB::table($table)->get();
            $jsonData[$table] = $rows;
        } catch (Exception $e) {
            $jsonData[$table] = ['error' => $e->getMessage()];
        }
    }
    
    file_put_contents($jsonBackupFile, json_encode($jsonData, JSON_PRETTY_PRINT));
    echo "JSON Backup: $jsonBackupFile\n";
    
    // List all existing backups
    echo "\nAll backups in storage/backups/:\n";
    $backups = glob($backupDir . '/database_backup_*.sql');
    foreach ($backups as $backup) {
        $size = round(filesize($backup) / 1024, 2);
        echo "  - " . basename($backup) . " ($size KB)\n";
    }
    
} catch (Exception $e) {
    echo "\n✗ Backup failed: " . $e->getMessage() . "\n";
}
