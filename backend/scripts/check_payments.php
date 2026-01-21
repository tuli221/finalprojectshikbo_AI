<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Payment;

echo "Checking all payments in database...\n\n";

$payments = Payment::with(['user', 'course'])->get();

echo "Total payments found: " . $payments->count() . "\n\n";

if ($payments->isEmpty()) {
    echo "No payments found in database!\n";
    exit;
}

echo str_pad("ID", 5) . " | " . 
     str_pad("User", 20) . " | " . 
     str_pad("Course", 30) . " | " . 
     str_pad("Amount", 10) . " | " . 
     str_pad("Status", 15) . " | " . 
     str_pad("Method", 15) . "\n";
echo str_repeat("-", 110) . "\n";

foreach ($payments as $payment) {
    $userName = $payment->user ? $payment->user->name : 'N/A';
    $courseName = $payment->course ? $payment->course->title : 'N/A';
    
    echo str_pad($payment->id, 5) . " | " . 
         str_pad(substr($userName, 0, 20), 20) . " | " . 
         str_pad(substr($courseName, 0, 30), 30) . " | " . 
         str_pad("৳" . number_format($payment->amount, 0), 10) . " | " . 
         str_pad($payment->status ?? 'N/A', 15) . " | " . 
         str_pad($payment->payment_method ?? 'N/A', 15) . "\n";
}

echo "\n";
echo "Status breakdown:\n";
$statusCounts = $payments->groupBy('status')->map->count();
foreach ($statusCounts as $status => $count) {
    echo "- {$status}: {$count}\n";
}
