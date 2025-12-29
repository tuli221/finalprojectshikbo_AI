<?php

namespace App\Http\Controllers;

use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InstructorController extends Controller
{
    /**
     * Display a listing of all instructors (for landing page).
     */
    public function index()
    {
        $instructors = Instructor::latest()->get();
        return response()->json($instructors);
    }

    /**
     * Display featured instructors.
     */
    public function featured()
    {
        $instructors = Instructor::where('is_featured', true)->get();
        return response()->json($instructors);
    }

    /**
     * Display the specified instructor with their courses.
     */
    public function show($id)
    {
        $instructor = Instructor::with('courses')->findOrFail($id);
        return response()->json($instructor);
    }

    /**
     * Store a newly created instructor (Admin only).
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:500',
            'company' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'expertise_tags' => 'nullable|string',
            'bio' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:18|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'linkedin' => 'nullable|url',
            'twitter' => 'nullable|url',
            'website' => 'nullable|url',
            'is_featured' => 'nullable|boolean',
            'status' => 'nullable|string|in:Pending,Approved,Rejected',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('instructor-images', 'public');
        }

        $instructor = Instructor::create([
            'name' => $request->name,
            'title' => $request->title,
            'role' => $request->role,
            'company' => $request->company,
            'specialization' => $request->specialization,
            'expertise_tags' => $request->expertise_tags,
            'bio' => $request->bio,
            'email' => $request->email,
            'phone' => $request->phone,
            'age' => $request->age,
            'image' => $imagePath,
            'linkedin' => $request->linkedin,
            'twitter' => $request->twitter,
            'website' => $request->website,
            'is_featured' => $request->is_featured ?? false,
            'join_date' => now(),
            'status' => $request->status ?? 'Pending',
        ]);

        return response()->json([
            'message' => 'Instructor created successfully',
            'instructor' => $instructor
        ], 201);
    }

    /**
     * Update the specified instructor (Admin only).
     */
    public function update(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'title' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:500',
            'company' => 'nullable|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'expertise_tags' => 'nullable|string',
            'bio' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:18|max:100',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'linkedin' => 'nullable|url',
            'twitter' => 'nullable|url',
            'website' => 'nullable|url',
            'is_featured' => 'nullable|boolean',
            'status' => 'nullable|string|in:Pending,Approved,Rejected',
        ]);

        if ($request->hasFile('image')) {
            if ($instructor->image) {
                Storage::disk('public')->delete($instructor->image);
            }
            $instructor->image = $request->file('image')->store('instructor-images', 'public');
        }

        $instructor->update($request->except(['image']));

        return response()->json([
            'message' => 'Instructor updated successfully',
            'instructor' => $instructor
        ]);
    }

    /**
     * Remove the specified instructor (Admin only).
     */
    public function destroy($id)
    {
        $instructor = Instructor::findOrFail($id);

        if ($instructor->image) {
            Storage::disk('public')->delete($instructor->image);
        }

        $instructor->delete();

        return response()->json([
            'message' => 'Instructor deleted successfully'
        ]);
    }
}
