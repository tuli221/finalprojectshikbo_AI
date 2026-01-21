<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Course;

echo "Creating payments from enrollments...\n\n";

// Get all enrollments that don't have a corresponding payment
$enrollments = Enrollment::with(['user', 'course'])->get();

echo "Found " . $enrollments->count() . " total enrollments\n";

$created = 0;
$skipped = 0;

foreach ($enrollments as $enrollment) {
    // Check if payment already exists for this enrollment
    $existingPayment = Payment::where('user_id', $enrollment->user_id)
        ->where('course_id', $enrollment->course_id)
        ->first();

    if ($existingPayment) {
        $skipped++;
        continue;
    }

    // Get course price
    $course = $enrollment->course;
    $amount = $course->discount_price ?? $course->price ?? 0;

    // Create payment record
    $payment = Payment::create([
        'tran_id' => 'txn_' . uniqid() . '_enrollment_' . $enrollment->id,
        'user_id' => $enrollment->user_id,
        'course_id' => $enrollment->course_id,
        'amount' => $amount,
        'currency' => 'BDT',
        'status' => 'Completed', // Since they're already enrolled, mark as completed
        'student_name' => $enrollment->user->name ?? 'N/A',
        'student_email' => $enrollment->user->email ?? 'N/A',
        'student_phone' => $enrollment->user->phone ?? '',
        'student_address' => $enrollment->user->address ?? '',
        'payment_method' => 'bKash', // Default payment method
        'created_at' => $enrollment->created_at, // Use enrollment creation date
        'updated_at' => $enrollment->updated_at,
    ]);

    $created++;
    echo "✓ Created payment for User#{$enrollment->user_id} - Course: {$course->title} - Amount: ৳{$amount}\n";
}

echo "\n===========================================\n";
echo "Summary:\n";
echo "- Created: $created payments\n";
echo "- Skipped (already exists): $skipped\n";
echo "===========================================\n";
