<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use Illuminate\Http\Request;

class InstructorStudentController extends Controller
{
    /**
     * Get students enrolled in instructor's courses (Instructor Student View)
     * Route: GET /api/instructor/students
     * Action: Fetch all students enrolled in courses taught by this instructor
     */
    public function getStudents(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'instructor') {
            return response()->json(['message' => 'Only instructors can access'], 403);
        }
        
        // Get all course IDs that belong to this instructor
        $courseIds = Course::where('instructor_id', $user->id)->pluck('id')->toArray();
        // Get all students enrolled in any of this instructor's courses with course details
        $students = User::where('role', 'student')->whereIn('course_id', $courseIds)->with('course')->get();
        
        return response()->json($students);
    }
}
