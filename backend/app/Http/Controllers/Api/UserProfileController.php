<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\StudentProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class UserProfileController extends Controller
{
    /**
     * Update authenticated user's profile (Student Profile Update)
     * Route: PUT /api/user/profile
     * Action: Update user's basic info and student profile fields
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $data = $request->only(['name', 'email', 'phone', 'bio', 'address']);

        // Update user primary fields (name and email) and save to database
        if (isset($data['name'])) $user->name = $data['name'];
        if (isset($data['email'])) $user->email = $data['email'];
        $user->save();

        // Update or create student_profile with additional fields (phone, address, bio)
        try {
            $profileData = [
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'bio' => $data['bio'] ?? null,
            ];
            // Create new profile if doesn't exist, otherwise update existing profile
            StudentProfile::updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
        } catch (\Exception $e) {
            logger()->error('Failed to save student profile: '.$e->getMessage());
        }

        // Only eager-load studentProfile relationship if the table exists in database
        try {
            if (Schema::hasTable('student_profiles')) {
                // Load the student profile relationship for this user
                $user = $user->load('studentProfile');
            }
        } catch (\Throwable $e) {
        }

        return response()->json(['message' => 'Profile saved', 'user' => $user]);
    }

    /**
     * Change authenticated user's password (Student Password Change)
     * Route: POST /api/user/password
     * Action: Verify current password and update with new password
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $data = $request->only(['current_password', 'new_password', 'new_password_confirmation']);
        if (!isset($data['current_password']) || !isset($data['new_password'])) {
            return response()->json(['message' => 'Missing fields'], 422);
        }

        // Verify current password matches the one stored in database
        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 403);
        }

        if ($data['new_password'] !== ($data['new_password_confirmation'] ?? null)) {
            return response()->json(['message' => 'Password confirmation does not match'], 422);
        }

        // Hash and update the new password in database
        $user->password = Hash::make($data['new_password']);
        $user->save();

        return response()->json(['message' => 'Password updated']);
    }

    /**
     * Unenroll authenticated user from course (Student Course Unenrollment)
     * Route: POST /api/user/unenroll
     * Action: Remove student from enrolled course and update course count
     */
    public function unenroll(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $oldCourseId = $user->course_id;
        if (!$oldCourseId) {
            return response()->json(['message' => 'No enrolled course'], 400);
        }

        // Decrement enrolled_count on the course student is leaving
        try {
            // Find the course by ID to update its enrollment count
            $oldCourse = \App\Models\Course::find($oldCourseId);
            if ($oldCourse && ($oldCourse->enrolled_count ?? 0) > 0) {
                $oldCourse->enrolled_count = max(0, ($oldCourse->enrolled_count ?? 0) - 1);
                $oldCourse->save();
            }
        } catch (\Exception $e) {}

        // Remove enrollment record from pivot table (many-to-many relationship)
        try {
            // Delete the course_user relationship record for this student and course
            DB::table('course_user')
                ->where('user_id', $user->id)
                ->where('course_id', $oldCourseId)
                ->delete();
        } catch (\Exception $e) {}

        // Clear user's course assignment fields and save to database
        $user->course_id = null;
        $user->enrollment_date = null;
        $user->save();

        return response()->json(['message' => 'Unenrolled successfully', 'user' => $user->load('course')]);
    }
}
