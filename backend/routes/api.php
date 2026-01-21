<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\CourseInformationController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\InstructorStudentController;
use App\Http\Controllers\Api\Admin\StudentController as AdminStudentController;
use App\Http\Controllers\Api\Admin\InstructorUserController;
use App\Http\Controllers\Api\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\InstructorStudentController as AdminInstructorStudentController;
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

/*
|--------------------------------------------------------------------------
|  Authentication Routes (লগইন/রেজিস্ট্রেশন)
|--------------------------------------------------------------------------
*/
Route::post('/login', [LoginController::class, 'store']);
Route::post('/register', [RegisterController::class, 'store']);
Route::post('/logout', [LoginController::class, 'destroy'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| ২. Public Routes 
|--------------------------------------------------------------------------
*/

// Course routes
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);

// Instructor routes
Route::get('/instructors', [InstructorController::class, 'index']);
Route::get('/instructors/featured', [InstructorController::class, 'featured']);
Route::get('/instructors/{id}', [InstructorController::class, 'show']);
Route::post('/instructors/requests', [InstructorController::class, 'submitRequest']);
Route::post('/instructors/check-declined', [StatsController::class, 'checkDeclined']);

// Stats and Leaderboard
Route::get('/stats', [StatsController::class, 'getStats']);
Route::get('/leaderboard', [StatsController::class, 'getLeaderboard']);

// Programs routes
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{id}', [ProgramController::class, 'show']);

// Booking routes
Route::post('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'store']);
Route::get('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'index']);

// Course Information routes
Route::get('/course-information', [CourseInformationController::class, 'index']);
Route::get('/course-information/{id}', [CourseInformationController::class, 'show']);
Route::get('/course-information/course/{courseId}', [CourseInformationController::class, 'getByCourse']);
Route::post('/course-information', [CourseInformationController::class, 'store']);
Route::put('/course-information/{id}', [CourseInformationController::class, 'update']);
Route::delete('/course-information/{id}', [CourseInformationController::class, 'destroy']);

// Payment routes
Route::get('/sslcommerz/redirect/{tran}', [\App\Http\Controllers\Api\PaymentController::class, 'gatewayRedirect']);
Route::post('/sslcommerz/callback/{tran}', [\App\Http\Controllers\Api\PaymentController::class, 'callback']);
Route::get('/sslcommerz/payment/{tran}', [\App\Http\Controllers\Api\PaymentController::class, 'getPayment']);


// Student Routes (After login for student student)

Route::middleware('auth:sanctum')->group(function () {
    // OTP verification
    Route::post('/otp/verify', [\App\Http\Controllers\Auth\OtpController::class, 'apiVerify']);
    Route::post('/otp/resend', [\App\Http\Controllers\Auth\OtpController::class, 'apiResend']);
    
    // Student dashboard
    Route::get('/student/dashboard', [\App\Http\Controllers\StudentController::class, 'dashboard']);
    Route::get('/student/payments', [\App\Http\Controllers\Api\PaymentController::class, 'listForUser']);
    
    // Course progress
    Route::get('/courses/{courseId}/progress', [\App\Http\Controllers\ProgressController::class, 'getProgress']);
    Route::post('/courses/{courseId}/progress', [\App\Http\Controllers\ProgressController::class, 'updateProgress']);
    
    // Profile management
    Route::put('/user/profile', [UserProfileController::class, 'updateProfile']);
    
    // Password change
    Route::post('/user/password', [UserProfileController::class, 'changePassword']);

    // Unenroll from course
    Route::post('/user/unenroll', [UserProfileController::class, 'unenroll']);

    // Payment initiation
    Route::post('/sslcommerz/initiate', [\App\Http\Controllers\Api\PaymentController::class, 'initiate']);
});


  // Instructor Routes 

Route::middleware('auth:sanctum')->group(function () {
    // View assigned courses
    Route::get('/my-courses', [CourseController::class, 'myCourses']);
    
    // View students in instructor's courses
    Route::get('/instructor/students', [InstructorStudentController::class, 'getStudents']);
});


// Admin Routes 

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    
    // ========== Course Management ==========
    Route::get('/courses', [CourseController::class, 'getAllCourses']);
    Route::post('/courses', [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::post('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    
    // ========== Instructor Management ==========
    Route::get('/instructors/users', [InstructorUserController::class, 'getApprovedInstructorUsers']);
    
    Route::post('/instructors', [InstructorController::class, 'store']);
    Route::put('/instructors/{id}', [InstructorController::class, 'update']);
    Route::delete('/instructors/{id}', [InstructorController::class, 'destroy']);
    
    // Instructor requests
    Route::get('/instructors/requests', [InstructorController::class, 'listRequests']);
    Route::post('/instructors/requests/{id}/approve', [InstructorController::class, 'approveRequest']);
    Route::post('/instructors/requests/{id}/decline', [InstructorController::class, 'declineRequest']);
    Route::delete('/instructors/requests/{id}', [InstructorController::class, 'deleteRequest']);

    // ========== Student Management ==========
    Route::get('/students', [AdminStudentController::class, 'index']);
    Route::get('/students/{id}', [AdminStudentController::class, 'show']);
    Route::get('/students/{id}/enrollments', [AdminStudentController::class, 'getEnrollments']);
    Route::get('/students/{id}/payments', [AdminStudentController::class, 'getPayments']);
    Route::put('/students/{id}', [AdminStudentController::class, 'update']);
    Route::delete('/students/{id}', [AdminStudentController::class, 'destroy']);

    // Payment Management 
    Route::get('/payments', [AdminPaymentController::class, 'index']);

    // ========== Analytics Dashboard ==========
    Route::get('/analytics', [AnalyticsController::class, 'index']);

    // ========== Instructor's Students View (Admin) ==========
    Route::get('/instructor/students', [AdminInstructorStudentController::class, 'getStudents']);

    // ========== Programs Management ==========
    Route::post('/programs', [ProgramController::class, 'store']);
    Route::put('/programs/{id}', [ProgramController::class, 'update']);
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);
    
    // ========== Bookings Management ==========
    Route::delete('/bookings/{id}', [\App\Http\Controllers\Api\BookingController::class, 'destroy']);
});
