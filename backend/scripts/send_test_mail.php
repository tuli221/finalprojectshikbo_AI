<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmed;
use App\Models\Booking;

// create a fake booking instance (not persisted) for email rendering
$booking = new Booking([
    'program_id' => 1,
    'slot_id' => 'slot-1',
    'slot_label' => 'Feb 21, 2026, 12:00 PM',
    'name' => 'Test User',
    'phone' => '0123456789',
    'email' => 'test@example.com',
]);

// send the mailable to MAIL_USERNAME from env for real SMTP test
try {
    $recipient = env('MAIL_USERNAME') ?: 'test@example.com';
    Mail::to($recipient)->send(new BookingConfirmed($booking));
    echo "Mail send attempted to {$recipient}\n";
} catch (\Throwable $e) {
    echo "Mail send failed: " . $e->getMessage() . "\n";
}
