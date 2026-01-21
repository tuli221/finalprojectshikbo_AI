<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    /**
     * Get public stats (Public Homepage Stats Display)
     * Route: GET /api/stats
     * Action: Fetch total count of students, published courses, and instructors
     */
    public function getStats()
    {
        // Count total number of users with student role
        $studentsCount = User::where('role', 'student')->count();
        // Count total number of published courses
        $coursesCount = Course::where('status', 'Published')->count();
        // Count total number of users with instructor role
        $instructorsCount = User::where('role', 'instructor')->count();
        
        return response()->json([
            'students' => $studentsCount,
            'courses' => $coursesCount,
            'instructors' => $instructorsCount,
        ]);
    }

    /**
     * Get leaderboard (Public Leaderboard Display)
     * Route: GET /api/leaderboard
     * Action: Fetch top 10 students ranked by experience points (XP)
     */
    public function getLeaderboard()
    {
        // Get top 10 students ordered by XP (experience points) in descending order
        $students = User::where('role', 'student')
            ->orderBy('xp', 'desc')
            ->take(10)
            ->get(['id', 'name', 'email', 'xp'])
            ->map(function($student, $index) {
                // Count enrolled courses for this student
                $coursesCount = Enrollment::where('user_id', $student->id)->count();
                
                return [
                    'rank' => $index + 1,
                    'name' => $student->name,
                    'xp' => $student->xp ?? 0,
                    'courses' => $coursesCount,
                    'avatar' => "https://api.dicebear.com/6.x/initials/svg?seed=" . urlencode($student->name)
                ];
            });
        
        return response()->json($students);
    }

    /**
     * Check if instructor email is declined (Instructor Request Validation)
     * Route: POST /api/instructors/check-declined
     * Action: Verify if an email has been previously declined for instructor role
     */
    public function checkDeclined(Request $request)
    {
        $email = $request->input('email');
        if (!$email) {
            return response()->json(['declined' => false]);
        }
        
        // Check if an instructor request with this email exists and has status 'Declined'
        $declined = \App\Models\InstructorRequest::where('email', $email)
            ->where('status', 'Declined')
            ->exists();
        
        return response()->json(['declined' => $declined]);
    }
}
