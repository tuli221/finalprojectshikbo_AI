<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Course;
use App\Models\Payment;
use App\Models\Enrollment;

echo "Testing Analytics Data...\n\n";

// Get course performance data
$coursePerformance = Course::withCount('enrollments')
    ->select('id', 'title', 'price')
    ->get()
    ->map(function($course) {
        // Calculate total revenue from completed payments for this specific course
        $revenue = Payment::where('course_id', $course->id)
            ->whereIn('status', ['completed', 'Completed', 'Success', 'success'])
            ->sum('amount');
        
        // Calculate average completion rate from enrollments
        $avgCompletion = Enrollment::where('course_id', $course->id)
            ->avg('progress_percentage');
        
        return [
            'course' => $course->title,
            'enrollments' => $course->enrollments_count ?? 0,
            'revenue' => $revenue,
            'completion' => $avgCompletion ? round($avgCompletion, 1) : 0
        ];
    });

echo "Course Performance:\n";
echo str_repeat("=", 100) . "\n";
echo str_pad("Course", 40) . " | " . 
     str_pad("Enrollments", 15) . " | " . 
     str_pad("Revenue", 15) . " | " . 
     str_pad("Completion %", 15) . "\n";
echo str_repeat("-", 100) . "\n";

foreach ($coursePerformance as $course) {
    echo str_pad(substr($course['course'], 0, 40), 40) . " | " . 
         str_pad($course['enrollments'], 15) . " | " . 
         str_pad("৳" . number_format($course['revenue'], 0), 15) . " | " . 
         str_pad($course['completion'] . "%", 15) . "\n";
}

echo "\n";
