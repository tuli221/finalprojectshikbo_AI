<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route as RouteFacade;

class EnsureOtpVerified
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (! $user) {
            if (RouteFacade::has('login')) {
                return redirect()->route('login');
            }

            return redirect('/login');
        }

        // Only enforce OTP verification for students
        if ($user->role === 'student' && is_null($user->otp_verified_at)) {
            // For web: redirect to OTP verification page
            if ($request->wantsJson()) {
                return response()->json(['message' => 'OTP verification required.'], 403);
            }

            if (RouteFacade::has('otp.verify.form')) {
                return redirect()->route('otp.verify.form');
            }

            return redirect('/otp/verify');
        }

        return $next($request);
    }
}
