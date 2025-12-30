<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\InstructorController;
use App\Models\User;
use Illuminate\Http\Request as HttpRequest;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [LoginController::class, 'store']);
Route::post('/register', [RegisterController::class, 'store']);
Route::post('/logout', [LoginController::class, 'destroy'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public routes - anyone can view
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::get('/instructors', [InstructorController::class, 'index']);
Route::get('/instructors/featured', [InstructorController::class, 'featured']);
Route::get('/instructors/{id}', [InstructorController::class, 'show']);

// Instructor routes - view assigned courses
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-courses', [CourseController::class, 'myCourses']);
    Route::get('/instructor/students', function(Request $request) {
        $user = $request->user();
        if (!$user || $user->role !== 'instructor') {
            return response()->json(['message' => 'Only instructors can access'], 403);
        }
        $courseIds = \App\Models\Course::where('instructor_id', $user->id)->pluck('id')->toArray();
        $students = User::where('role', 'student')->whereIn('course_id', $courseIds)->with('course')->get();
        return response()->json($students);
    });
});

// Admin routes - manage courses and instructors
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Course management
    Route::get('/courses', [CourseController::class, 'getAllCourses']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    
    // Get users with instructor role
    Route::get('/instructors/users', function() {
        return response()->json(\App\Models\User::where('role', 'instructor')->get(['id', 'name', 'email']));
    });
    
    // Instructor profile management
    Route::post('/instructors', [InstructorController::class, 'store']);
    Route::put('/instructors/{id}', [InstructorController::class, 'update']);
    Route::delete('/instructors/{id}', [InstructorController::class, 'destroy']);

    // Student management (admin)
    Route::get('/students', function() {
        return response()->json(User::where('role', 'student')->with('course')->get());
    });

    Route::put('/students/{id}', function(HttpRequest $request, $id) {
        $user = User::findOrFail($id);
        $data = $request->only(['name', 'email', 'role', 'phone', 'address', 'course_id', 'enrollment_date']);

        // adjust enrolled_count if course changed
        $oldCourseId = $user->course_id;
        $newCourseId = isset($data['course_id']) ? $data['course_id'] : $oldCourseId;

        if ($oldCourseId && $oldCourseId != $newCourseId) {
            try {
                $oldCourse = \App\Models\Course::find($oldCourseId);
                if ($oldCourse && ($oldCourse->enrolled_count ?? 0) > 0) {
                    $oldCourse->enrolled_count = max(0, ($oldCourse->enrolled_count ?? 0) - 1);
                    $oldCourse->save();
                }
            } catch (\Exception $e) {}
        }

        if ($newCourseId && $oldCourseId != $newCourseId) {
            try {
                $newCourse = \App\Models\Course::find($newCourseId);
                if ($newCourse) {
                    $newCourse->enrolled_count = ($newCourse->enrolled_count ?? 0) + 1;
                    $newCourse->save();
                }
            } catch (\Exception $e) {}
        }

        $user->fill($data);
        $user->save();
        return response()->json($user->load('course'));
    });

    Route::delete('/students/{id}', function($id) {
        $user = User::findOrFail($id);
        // decrement enrolled_count if assigned
        if ($user->course_id) {
            try {
                $course = \App\Models\Course::find($user->course_id);
                if ($course && ($course->enrolled_count ?? 0) > 0) {
                    $course->enrolled_count = max(0, ($course->enrolled_count ?? 0) - 1);
                    $course->save();
                }
            } catch (\Exception $e) {}
        }

        $user->delete();
        return response()->json(['message' => 'Student deleted']);
    });

    // Instructor: get students for courses assigned to authenticated instructor
    Route::get('/instructor/students', function(HttpRequest $request) {
        $user = $request->user();
        if (!$user || $user->role !== 'instructor') {
            return response()->json(['message' => 'Only instructors can access'], 403);
        }
        $courseIds = \App\Models\Course::where('instructor_id', $user->id)->pluck('id')->toArray();
        $students = User::where('role', 'student')->whereIn('course_id', $courseIds)->with('course')->get();
        return response()->json($students);
    });
});
