<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Payment;

echo "Updating payment methods...\n\n";

$payments = Payment::whereNull('payment_method')
    ->orWhere('payment_method', '')
    ->get();

echo "Found {$payments->count()} payments without payment method\n\n";

$methods = ['bKash', 'Nagad', 'Rocket', 'Card'];

foreach ($payments as $payment) {
    // Assign a random payment method
    $payment->payment_method = $methods[array_rand($methods)];
    $payment->save();
    
    echo "✓ Updated Payment #{$payment->id} - Method: {$payment->payment_method}\n";
}

echo "\nDone! All payments now have payment methods.\n";
