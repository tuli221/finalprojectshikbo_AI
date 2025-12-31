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
        $courseEnrolled = $user->course_id ? 1 : 0;
        $lessonsCompleted = 0; // placeholder if you add progress tracking
        $xpEarned = 0;

        // recommended courses (published, exclude assigned course)
        $recommended = Course::where('status', 'Published')
            ->when($user->course_id, function ($q) use ($user) {
                return $q->where('id', '!=', $user->course_id);
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
            'user' => $user,
        ]);
    }
}
