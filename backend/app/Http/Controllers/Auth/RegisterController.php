<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisterController extends Controller
{
    /**
     * Handle an incoming registration request.
     * 
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:admin,student,instructor'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'enrollment_date' => ['nullable', 'date'],
            'course_id' => ['nullable', 'exists:courses,id']
        ]);
        
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone' => $request->phone ?? null,
            'address' => $request->address ?? null,
            'enrollment_date' => $request->enrollment_date ?? null,
            'course_id' => $request->course_id ?? null,
        ]);
        
        event(new Registered($user));
        
        $token = $user->createToken('auth_token')->plainTextToken;

        // If the user was assigned a course, increment the course enrolled count
        if ($user->course_id) {
            try {
                $course = \App\Models\Course::find($user->course_id);
                if ($course) {
                    $course->enrolled_count = ($course->enrolled_count ?? 0) + 1;
                    $course->save();
                }
            } catch (\Exception $e) {
                // ignore
            }
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }
}
