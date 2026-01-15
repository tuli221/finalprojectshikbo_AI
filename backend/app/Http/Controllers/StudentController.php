<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Course;

class StudentController extends Controller
{
    /**
     * Return dashboard data for authenticated student.
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        if (! $user || $user->role !== 'student') {
            return response()->json(['message' => 'Only students can access'], 403);
        }

        // Basic stats (expand later)
        // Count enrolled courses from multiple sources so dashboard matches MyCourses/Report
        $enrolledIds = [];
        try {
            // from enrollments table
            if (method_exists($user, 'enrollments')) {
                $enrolledIds = $user->enrollments()->pluck('course_id')->toArray();
            }
            // from completed payments (user may have paid but enrollment record not yet created)
            try {
                $paid = \App\Models\Payment::where('user_id', $user->id)->where('status', 'completed')->pluck('course_id')->toArray();
                $enrolledIds = array_merge($enrolledIds, $paid);
            } catch (\Exception $e) {
                // ignore if payments table missing or query fails
            }
        } catch (\Exception $e) {
            $enrolledIds = [];
        }
        // include legacy single assignment
        if (! empty($user->course_id)) {
            $enrolledIds[] = $user->course_id;
        }
        $enrolledIds = array_values(array_unique(array_filter($enrolledIds)));
        $courseEnrolled = count($enrolledIds);
        $lessonsCompleted = 0; // placeholder if you add progress tracking
        $xpEarned = 0;

        // recommended courses (published), exclude any courses the user is already enrolled in
        $recommended = Course::where('status', 'Published')
            ->when(count($enrolledIds) > 0, function ($q) use ($enrolledIds) {
                return $q->whereNotIn('id', $enrolledIds);
            })
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'stats' => [
                'course_enrolled' => $courseEnrolled,
                'lessons_completed' => $lessonsCompleted,
                'xp_earned' => $xpEarned,
            ],
            'recommended' => $recommended,
            // include enrollments (history) and legacy course relation for compatibility
            // eager-load instructor on courses so frontend can display instructor info
            'user' => $user->load(['enrollments.course.instructor', 'course.instructor']),
        ]);
    }
}
