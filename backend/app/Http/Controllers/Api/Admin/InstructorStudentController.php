<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class InstructorStudentController extends Controller
{
    /**
     * Get students for courses assigned to authenticated instructor (Admin Instructor Student View)
     * Route: GET /api/admin/instructor/students
     * Action: Fetch all students enrolled in instructor's courses with enrollment details
     */
    public function getStudents(Request $request)
    {
        $user = $request->user();
        if (!$user || $user->role !== 'instructor') {
            return response()->json(['message' => 'Only instructors can access'], 403);
        }

        // Get all course IDs assigned to this instructor
        $courseIds = Course::where('instructor_id', $user->id)->pluck('id')->toArray();
        $results = [];

        // Get students from enrollments table (preferred method)
        try {
            // Get all enrollments for instructor's courses with user and course relationships
            $enrollments = Enrollment::whereIn('course_id', $courseIds)
                ->with(['user', 'course'])
                ->orderBy('enrolled_at', 'desc')
                ->get();

            foreach ($enrollments as $en) {
                $u = $en->user;
                if (!$u) continue;
                $results[$u->id] = [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'course' => $en->course ? $en->course->only(['id','title']) : null,
                    'enrollment_date' => $en->enrolled_at ? $en->enrolled_at->toDateString() : ($u->enrollment_date ? $u->enrollment_date : null),
                ];
            }
        } catch (\Exception $e) {
        }

        // Legacy assignments via users.course_id (fallback for old enrollment system)
        try {
            // Get students directly from users table where course_id matches instructor's courses
            $legacy = User::where('role', 'student')->whereIn('course_id', $courseIds)->with('course')->get();
            foreach ($legacy as $u) {
                if (isset($results[$u->id])) continue;
                $results[$u->id] = [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'course' => $u->course ? $u->course->only(['id','title']) : null,
                    'enrollment_date' => $u->enrollment_date ? $u->enrollment_date : null,
                ];
            }
        } catch (\Exception $e) {}

        return response()->json(array_values($results));
    }
}
