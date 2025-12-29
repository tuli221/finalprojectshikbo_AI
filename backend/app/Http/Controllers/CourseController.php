<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class CourseController extends Controller
{
    /**
     * Display a listing of all published courses (for public courses page).
     */
    public function index()
    {
        $courses = Course::with(['instructor', 'instructorProfile'])
            ->where('status', 'Published')
            ->latest()
            ->get();
        return response()->json($courses);
    }

    /**
     * Store a newly created course (Admin only).
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'description' => 'required|string',
            'level' => 'required|in:Beginner,Intermediate,Advanced',
            'lessons' => 'required|integer|min:1',
            'discount_price' => 'nullable|numeric|min:0',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'nullable|in:Draft,Published,Archived',
            'instructor_id' => 'required|exists:users,id',
            'instructor_profile_id' => 'nullable|exists:instructors,id',
            'language' => 'nullable|string',
            'requirements' => 'nullable|string',
            'what_you_learn' => 'nullable|string',
            'course_modules' => 'nullable|string',
            'video_url' => 'nullable|url',
            'certificate' => 'nullable|boolean',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('course-thumbnails', 'public');
        }

        $payload = [
            'title' => $request->title,
            'category' => $request->category,
            'price' => $request->price,
            'duration' => $request->duration,
            'description' => $request->description,
            'level' => $request->level,
            'lessons' => $request->lessons,
            'discount_price' => $request->discount_price,
            'thumbnail' => $thumbnailPath,
            'status' => $request->status ?? 'Published',
            'instructor_id' => $request->instructor_id,
            'instructor_profile_id' => $request->instructor_profile_id,
            'language' => $request->language ?? 'English',
            'requirements' => $request->requirements,
            'what_you_learn' => $request->what_you_learn,
            'course_modules' => $request->course_modules,
            'video_url' => $request->video_url,
            'certificate' => $request->certificate ?? true,
        ];

        // Some installs have an `instructor` column (string/int) that is NOT NULL.
        // If present, set the instructor name from the assigned user
        if (Schema::hasColumn('courses', 'instructor')) {
            $instructorUser = \App\Models\User::find($request->instructor_id);
            if ($instructorUser) {
                $payload['instructor'] = $instructorUser->name;
            } else {
                $payload['instructor'] = 'Unknown';
            }
        }

            $course = Course::create($payload);
        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course->load(['instructor', 'instructorProfile'])
        ], 201);
    }

    /**
     * Display the specified course.
     */
    public function show($id)
    {
        $course = Course::with(['instructor', 'instructorProfile'])->findOrFail($id);
        return response()->json($course);
    }

    /**
     * Update the specified course (Admin only).
     */
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        // Only admin can update courses
        // if ($course->instructor_id !== Auth::id()) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'duration' => 'sometimes|integer|min:1',
            'description' => 'sometimes|string',
            'level' => 'sometimes|in:Beginner,Intermediate,Advanced',
            'lessons' => 'sometimes|integer|min:1',
            'discount_price' => 'sometimes|numeric|min:0',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'sometimes|in:Draft,Published,Archived',
            'instructor_profile_id' => 'nullable|exists:instructors,id',
            'language' => 'nullable|string',
            'requirements' => 'nullable|string',
            'what_you_learn' => 'nullable|string',
            'course_modules' => 'nullable|string',
            'video_url' => 'nullable|url',
            'certificate' => 'nullable|boolean',
        ]);

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($course->thumbnail) {
                Storage::disk('public')->delete($course->thumbnail);
            }
            $course->thumbnail = $request->file('thumbnail')->store('course-thumbnails', 'public');
        }

        $course->update($request->except(['thumbnail', 'instructor_id']));

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $course->load(['instructor', 'instructorProfile'])
        ]);
    }

    /**
     * Remove the specified course (Admin only).
     */
    public function destroy($id)
    {
        $course = Course::findOrFail($id);

        // Only admin can delete
        // if ($course->instructor_id !== Auth::id()) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        // Delete thumbnail if exists
        if ($course->thumbnail) {
            Storage::disk('public')->delete($course->thumbnail);
        }

        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }

    /**
     * Get all courses for admin dashboard.
     */
    public function getAllCourses()
    {
        $courses = Course::with(['instructor', 'instructorProfile'])
            ->latest()
            ->get();
        return response()->json($courses);
    }

    /**
     * Get courses assigned to authenticated instructor.
     * Fetches courses where instructor_id matches the authenticated user's id.
     */
    public function myCourses()
    {
        $user = Auth::user();
        
        // Check if user has instructor role
        if (!$user || $user->role !== 'instructor') {
            return response()->json([
                'message' => 'Only instructors can access assigned courses'
            ], 403);
        }

        // Fetch courses assigned to this instructor via instructor_id
        $courses = Course::where('instructor_id', $user->id)
            ->with(['instructor', 'instructorProfile'])
            ->latest()
            ->get();
            
        return response()->json($courses);
    }
}
