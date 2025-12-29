<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\InstructorController;

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
});
