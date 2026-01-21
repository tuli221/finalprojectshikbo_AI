<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    /**
     * Get analytics data for admin dashboard (Admin Analytics Dashboard)
     * Route: GET /api/admin/analytics
     * Action: Fetch comprehensive statistics including users, revenue, and course performance
     */
    public function index()
    {
        try {
            // Count total number of all users in the system
            $totalUsers = User::count();
            // Count total number of student users
            $totalStudents = User::where('role', 'student')->count();
            // Count total number of instructor users
            $totalInstructors = User::where('role', 'instructor')->count();
            // Count total number of active courses
            $activeCourses = Course::where('status', 'Active')->count();
            
            // Calculate total revenue from completed payments (case-insensitive status check)
            $totalRevenue = Payment::whereIn('status', ['completed', 'Completed', 'Success', 'success'])->sum('amount');
            // Calculate pending revenue from incomplete payments
            $pendingRevenue = Payment::whereIn('status', ['pending', 'Pending'])->sum('amount');
            
            // Get course performance data with enrollment count for each course
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

            return response()->json([
                'overview' => [
                    'totalUsers' => $totalUsers,
                    'totalStudents' => $totalStudents,
                    'totalInstructors' => $totalInstructors,
                    'activeCourses' => $activeCourses,
                    'totalRevenue' => $totalRevenue,
                    'pendingRevenue' => $pendingRevenue,
                ],
                'coursePerformance' => $coursePerformance
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
