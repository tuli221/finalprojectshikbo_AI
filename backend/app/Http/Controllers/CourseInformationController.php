<?php

namespace App\Http\Controllers;

use App\Models\CourseInformation;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class CourseInformationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courseInformation = CourseInformation::with('course')->get();
        return response()->json($courseInformation);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'course_id' => 'required|exists:courses,id',
            'about_course' => 'nullable|string',
            'what_you_learn' => 'nullable|string',
            'modules' => 'nullable|string', // JSON string
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if course information already exists
            $existing = CourseInformation::where('course_id', $request->course_id)->first();
            if ($existing) {
                return response()->json([
                    'message' => 'Course information already exists for this course'
                ], 409);
            }

            $courseInformation = CourseInformation::create([
                'course_id' => $request->course_id,
                'about_course' => $request->about_course,
                'what_you_learn' => $request->what_you_learn,
                'modules' => $request->modules,
            ]);

            return response()->json([
                'message' => 'Course information created successfully',
                'data' => $courseInformation
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create course information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $courseInformation = CourseInformation::with('course')->find($id);

        if (!$courseInformation) {
            return response()->json(['message' => 'Course information not found'], 404);
        }

        return response()->json($courseInformation);
    }

    /**
     * Get course information by course_id
     */
    public function getByCourse($courseId)
    {
        $courseInformation = CourseInformation::where('course_id', $courseId)->with('course')->first();

        if (!$courseInformation) {
            return response()->json(['message' => 'Course information not found'], 404);
        }

        return response()->json($courseInformation);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $courseInformation = CourseInformation::find($id);

        if (!$courseInformation) {
            return response()->json(['message' => 'Course information not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'about_course' => 'nullable|string',
            'what_you_learn' => 'nullable|string',
            'modules' => 'nullable|string', // JSON string
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $courseInformation->update($request->only([
                'about_course',
                'what_you_learn',
                'modules'
            ]));

            return response()->json([
                'message' => 'Course information updated successfully',
                'data' => $courseInformation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update course information',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $courseInformation = CourseInformation::find($id);

        if (!$courseInformation) {
            return response()->json(['message' => 'Course information not found'], 404);
        }

        $courseInformation->delete();

        return response()->json(['message' => 'Course information deleted successfully']);
    }
}
