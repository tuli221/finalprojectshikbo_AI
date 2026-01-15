<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\CourseInformationController;
use App\Http\Controllers\Api\ProgramController;
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

// OTP API routes (authenticated) - top-level
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/otp/verify', [\App\Http\Controllers\Auth\OtpController::class, 'apiVerify']);
    Route::post('/otp/resend', [\App\Http\Controllers\Auth\OtpController::class, 'apiResend']);
    // Student dashboard
    Route::get('/student/dashboard', [\App\Http\Controllers\StudentController::class, 'dashboard']);
    // Student payments (for report page)
    Route::get('/student/payments', [\App\Http\Controllers\Api\PaymentController::class, 'listForUser']);
    // Update authenticated user's profile (including student profile fields)
    Route::put('/user/profile', function (Illuminate\Http\Request $request) {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $data = $request->only(['name', 'email', 'phone', 'bio', 'address']);

        // update user primary fields
        if (isset($data['name'])) $user->name = $data['name'];
        if (isset($data['email'])) $user->email = $data['email'];
        $user->save();

        // update or create student_profile
        try {
            $profileData = [
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'bio' => $data['bio'] ?? null,
            ];
            \App\Models\StudentProfile::updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
        } catch (\Exception $e) {
            // ignore profile write errors but log
            logger()->error('Failed to save student profile: '.$e->getMessage());
        }

        // Only eager-load studentProfile if the table exists (migrations may not have run yet)
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('student_profiles')) {
                $user = $user->load('studentProfile');
            }
        } catch (\Throwable $e) {
            // If Schema check fails for any reason, continue without the relation
        }

        return response()->json(['message' => 'Profile saved', 'user' => $user]);
    });
    // Allow authenticated user to change their password
    Route::post('/user/password', function (Illuminate\Http\Request $request) {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $data = $request->only(['current_password', 'new_password', 'new_password_confirmation']);
        if (!isset($data['current_password']) || !isset($data['new_password'])) {
            return response()->json(['message' => 'Missing fields'], 422);
        }

        // verify current password
        if (! \Illuminate\Support\Facades\Hash::check($data['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 403);
        }

        if ($data['new_password'] !== ($data['new_password_confirmation'] ?? null)) {
            return response()->json(['message' => 'Password confirmation does not match'], 422);
        }

        // update password
        $user->password = \Illuminate\Support\Facades\Hash::make($data['new_password']);
        $user->save();

        return response()->json(['message' => 'Password updated']);
    });

    // Allow authenticated user to unenroll from their assigned course
    Route::post('/user/unenroll', function (Illuminate\Http\Request $request) {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $oldCourseId = $user->course_id;
        if (! $oldCourseId) {
            return response()->json(['message' => 'No enrolled course'], 400);
        }

        // decrement enrolled_count on old course
        try {
            $oldCourse = \App\Models\Course::find($oldCourseId);
            if ($oldCourse && ($oldCourse->enrolled_count ?? 0) > 0) {
                $oldCourse->enrolled_count = max(0, ($oldCourse->enrolled_count ?? 0) - 1);
                $oldCourse->save();
            }
        } catch (\Exception $e) {}

        // remove pivot entry if exists
        try {
            \Illuminate\Support\Facades\DB::table('course_user')
                ->where('user_id', $user->id)
                ->where('course_id', $oldCourseId)
                ->delete();
        } catch (\Exception $e) {}

        // clear user's course assignment
        $user->course_id = null;
        $user->enrollment_date = null;
        $user->save();

        return response()->json(['message' => 'Unenrolled successfully', 'user' => $user->load('course')]);
    });

    // Initiate SSLCommerz payment (creates payment record and returns redirect URL)
    Route::post('/sslcommerz/initiate', [\App\Http\Controllers\Api\PaymentController::class, 'initiate']);
});

// Public routes - anyone can view
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::get('/instructors', [InstructorController::class, 'index']);
Route::get('/instructors/featured', [InstructorController::class, 'featured']);
Route::get('/instructors/{id}', [InstructorController::class, 'show']);
// Allow users to submit instructor requests (creates a Pending instructor profile)
Route::post('/instructors/requests', [InstructorController::class, 'submitRequest']);
// Public endpoint to check if email is declined
Route::post('/instructors/check-declined', function(Illuminate\Http\Request $request) {
    $email = $request->input('email');
    if (!$email) {
        return response()->json(['declined' => false]);
    }
    
    $declined = \App\Models\InstructorRequest::where('email', $email)
        ->where('status', 'Declined')
        ->exists();
    
    return response()->json(['declined' => $declined]);
});

// Learning Center Programs (public)
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{id}', [ProgramController::class, 'show']);

// Public booking endpoint - creates a booking and sends confirmation email
Route::post('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'store']);
// Allow fetching bookings (admin UI or debugging)
Route::get('/bookings', [\App\Http\Controllers\Api\BookingController::class, 'index']);

// Simulated gateway redirect and callback for testing
Route::get('/sslcommerz/redirect/{tran}', [\App\Http\Controllers\Api\PaymentController::class, 'gatewayRedirect']);
Route::post('/sslcommerz/callback/{tran}', [\App\Http\Controllers\Api\PaymentController::class, 'callback']);
// Fetch payment by transaction id (public)
Route::get('/sslcommerz/payment/{tran}', [\App\Http\Controllers\Api\PaymentController::class, 'getPayment']);

// Course Information routes
Route::get('/course-information', [CourseInformationController::class, 'index']);
Route::get('/course-information/{id}', [CourseInformationController::class, 'show']);
Route::get('/course-information/course/{courseId}', [CourseInformationController::class, 'getByCourse']);
Route::post('/course-information', [CourseInformationController::class, 'store']);
Route::put('/course-information/{id}', [CourseInformationController::class, 'update']);
Route::delete('/course-information/{id}', [CourseInformationController::class, 'destroy']);

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
    Route::post('/courses/{id}', [CourseController::class, 'update']); // Support _method=PUT for FormData
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
    
    // Get users who have approved instructor profiles (admin)
    Route::get('/instructors/users', function() {
        $users = \App\Models\User::whereExists(function($q) {
            $q->select(\DB::raw(1))
              ->from('instructors')
              ->whereColumn('instructors.user_id', 'users.id')
              ->orWhereColumn('instructors.email', 'users.email');
        })->get(['id', 'name', 'email']);

        return response()->json($users);
    });
    // (admin) other admin routes continue...
    
    // Instructor profile management
    Route::post('/instructors', [InstructorController::class, 'store']);
    Route::put('/instructors/{id}', [InstructorController::class, 'update']);
    Route::delete('/instructors/{id}', [InstructorController::class, 'destroy']);
    // Instructor requests management (admin)
    Route::get('/instructors/requests', [InstructorController::class, 'listRequests']);
    Route::post('/instructors/requests/{id}/approve', [InstructorController::class, 'approveRequest']);
    Route::post('/instructors/requests/{id}/decline', [InstructorController::class, 'declineRequest']);
    Route::delete('/instructors/requests/{id}', [InstructorController::class, 'deleteRequest']);

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

        // Collect students from enrollments (preferred) and legacy user.course_id
        $results = [];

        try {
            $enrollments = \App\Models\Enrollment::whereIn('course_id', $courseIds)
                ->with(['user', 'course'])
                ->orderBy('enrolled_at', 'desc')
                ->get();

            foreach ($enrollments as $en) {
                $u = $en->user;
                if (! $u) continue;
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
            // If enrollments table absent or error, ignore and fall back to legacy
        }

        // Legacy assignments via users.course_id
        try {
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

        // Return values
        return response()->json(array_values($results));
    });

    // Programs management (admin only)
    Route::post('/programs', [ProgramController::class, 'store']);
    Route::put('/programs/{id}', [ProgramController::class, 'update']);
    Route::delete('/programs/{id}', [ProgramController::class, 'destroy']);
});
