<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    /**
     * Get progress for a specific enrollment
     */
    public function getProgress(Request $request, $courseId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json([
                'completed_lessons' => [],
                'progress_percentage' => 0
            ]);
        }

        return response()->json([
            'completed_lessons' => $enrollment->completed_lessons ?? [],
            'progress_percentage' => $enrollment->progress_percentage ?? 0
        ]);
    }

    /**
     * Update progress for a specific enrollment
     */
    public function updateProgress(Request $request, $courseId)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'completed_lessons' => 'required|array',
            'progress_percentage' => 'required|integer|min:0|max:100'
        ]);

        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'Enrollment not found'], 404);
        }

        $enrollment->update([
            'completed_lessons' => $request->completed_lessons,
            'progress_percentage' => $request->progress_percentage
        ]);

        // Calculate total XP from all enrollments of this user
        $totalXP = \App\Models\Enrollment::where('user_id', $user->id)
            ->sum('progress_percentage'); // Sum all progress percentages
        $totalXP = $totalXP * 10; // Each 5% = 50 XP, so total% * 10 = total XP
        
        $user->update(['xp' => $totalXP]);

        return response()->json([
            'message' => 'Progress updated successfully',
            'data' => [
                'completed_lessons' => $enrollment->completed_lessons,
                'progress_percentage' => $enrollment->progress_percentage,
                'xp' => $user->xp
            ]
        ]);
    }
}
