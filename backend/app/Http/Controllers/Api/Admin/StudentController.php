<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Course;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Get all students (Admin Student List View)
     * Route: GET /api/admin/students
     * Action: Fetch all students with their enrolled courses
     */
    public function index()
    {
        // Query to fetch all users with role 'student' and eager load their enrolled course
        return response()->json(User::where('role', 'student')->with('course')->get());
    }

    /**
     * Get single student details (Admin Student Detail View)
     * Route: GET /api/admin/students/{id}
     * Action: Fetch specific student information by ID
     */
    public function show($id)
    {
        // Find student by ID with role 'student' and load their course, throw 404 if not found
        $student = User::where('role', 'student')->with('course')->findOrFail($id);
        return response()->json($student);
    }

    /**
     * Get student's enrollments (Admin Student Enrollment History)
     * Route: GET /api/admin/students/{id}/enrollments
     * Action: Fetch all course enrollments for a student
     */
    public function getEnrollments($id)
    {
        try {
            // Get all enrollments for this student with course details, ordered by enrollment date (newest first)
            $enrollments = Enrollment::where('user_id', $id)
                ->with('course')
                ->orderBy('enrolled_at', 'desc')
                ->get();
            return response()->json($enrollments);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Get student's payments (Admin Student Payment History)
     * Route: GET /api/admin/students/{id}/payments
     * Action: Fetch all payment records for a student
     */
    public function getPayments($id)
    {
        try {
            // Get all payment records for this student with course information, ordered by payment date (newest first)
            $payments = Payment::where('user_id', $id)
                ->with('course')
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json($payments);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Update student details (Admin Student Edit/Update)
     * Route: PUT /api/admin/students/{id}
     * Action: Update student information and handle course enrollment changes
     */
    public function update(Request $request, $id)
    {
        // Find the student user by ID, throw 404 if not found
        $user = User::findOrFail($id);
        $data = $request->only(['name', 'email', 'role', 'phone', 'address', 'course_id', 'enrollment_date']);

        // Adjust enrolled_count if course changed
        $oldCourseId = $user->course_id;
        $newCourseId = isset($data['course_id']) ? $data['course_id'] : $oldCourseId;

        if ($oldCourseId && $oldCourseId != $newCourseId) {
            try {
                // Find the old course to decrement its enrolled count
                $oldCourse = Course::find($oldCourseId);
                if ($oldCourse && ($oldCourse->enrolled_count ?? 0) > 0) {
                    $oldCourse->enrolled_count = max(0, ($oldCourse->enrolled_count ?? 0) - 1);
                    $oldCourse->save();
                }
            } catch (\Exception $e) {}
        }

        if ($newCourseId && $oldCourseId != $newCourseId) {
            try {
                // Find the new course to increment its enrolled count
                $newCourse = Course::find($newCourseId);
                if ($newCourse) {
                    $newCourse->enrolled_count = ($newCourse->enrolled_count ?? 0) + 1;
                    $newCourse->save();
                }
            } catch (\Exception $e) {}
        }

        // Update student data and save to database
        $user->fill($data);
        $user->save();
        // Return updated student with course relationship loaded
        return response()->json($user->load('course'));
    }

    /**
     * Delete student from database (Admin Student Delete)
     * Route: DELETE /api/admin/students/{id}
     * Action: Permanently remove student and update course enrollment count
     */
    public function destroy($id)
    {
        // Find the student user by ID, throw 404 if not found
        $user = User::findOrFail($id);
        
        // Decrement enrolled_count if student was assigned to a course
        if ($user->course_id) {
            try {
                // Find the course this student was enrolled in
                $course = Course::find($user->course_id);
                if ($course && ($course->enrolled_count ?? 0) > 0) {
                    $course->enrolled_count = max(0, ($course->enrolled_count ?? 0) - 1);
                    $course->save();
                }
            } catch (\Exception $e) {}
        }

        // Permanently delete the student user from database
        $user->delete();
        return response()->json(['message' => 'Student deleted']);
    }
}
