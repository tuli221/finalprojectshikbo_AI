<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Course;
use App\Models\User;
use App\Models\Enrollment;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    public function initiate(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $data = $request->validate([
            'course_id' => 'required|integer',
            'student_name' => 'nullable|string',
            'student_email' => 'nullable|email',
            'student_phone' => 'nullable|string',
            'student_address' => 'nullable|string',
        ]);

        // Update user profile with provided information
        if (!empty($data['student_phone'])) {
            $user->phone = $data['student_phone'];
        }
        if (!empty($data['student_name'])) {
            $user->name = $data['student_name'];
        }
        if (!empty($data['student_address'])) {
            $user->address = $data['student_address'];
        }
        $user->save();

        $course = Course::find($data['course_id']);
        if (! $course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        // Prevent creating a payment if the user is already enrolled in this course
        try {
            $alreadyEnrolled = false;
            if (! empty($user->course_id) && $user->course_id == $course->id) {
                $alreadyEnrolled = true;
            } else {
                $alreadyEnrolled = \App\Models\Enrollment::where('user_id', $user->id)
                    ->where('course_id', $course->id)
                    ->exists();
            }
            if ($alreadyEnrolled) {
                return response()->json(['message' => 'You are already enrolled in this course'], 409);
            }
        } catch (\Exception $e) {
            // if the enrollments table doesn't exist yet or query fails, fall back to allowing payment
        }

        $amount = $course->discount_price ?? $course->price ?? 0;

        // create a local payment record
        $tran = 'txn_'.uniqid();
        $payment = Payment::create([
            'tran_id' => $tran,
            'user_id' => $user->id,
            'course_id' => $course->id,
            'amount' => $amount,
            'currency' => 'BDT',
            'status' => 'initiated',
            'student_name' => $data['student_name'] ?? $user->name,
            'student_email' => $data['student_email'] ?? $user->email,
            'student_phone' => $data['student_phone'] ?? $user->phone,
            'student_address' => $data['student_address'] ?? null,
        ]);

        // If SSLCOMMERZ credentials are provided in env, attempt real gateway initiation
        $storeId = env('SSLCOMMERZ_STORE_ID');
        $storePass = env('SSLCOMMERZ_STORE_PASSWORD');

        if ($storeId && $storePass) {
            // Allow overriding the gateway endpoints via env vars for testing
            $isSandbox = filter_var(env('SSLCOMMERZ_SANDBOX', true), FILTER_VALIDATE_BOOLEAN);
            $sandboxUrl = env('SSLCOMMERZ_SANDBOX_URL', 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php');
            $productionUrl = env('SSLCOMMERZ_PRODUCTION_URL', 'https://securepay.sslcommerz.com/gwprocess/v4/api.php');
            $apiUrl = $isSandbox ? $sandboxUrl : $productionUrl;

            // The gateway should POST/redirect to our backend callback URL so we can process the response
            $appUrl = config('app.url') ?: $request->getSchemeAndHttpHost();
            $callbackBase = rtrim($appUrl, '/');
            $successUrl = $callbackBase . '/api/sslcommerz/callback/' . $tran;
            $failUrl = $callbackBase . '/api/sslcommerz/callback/' . $tran;
            $cancelUrl = $callbackBase . '/api/sslcommerz/callback/' . $tran;

            $payload = [
                'store_id' => $storeId,
                'store_passwd' => $storePass,
                'total_amount' => (float) $amount,
                'currency' => 'BDT',
                'tran_id' => $tran,
                'success_url' => $successUrl,
                'fail_url' => $failUrl,
                'cancel_url' => $cancelUrl,
                'cus_name' => $user->name ?? 'Customer',
                'cus_email' => $user->email ?? '',
                // Product information required by SSLCommerz
                'product_name' => $course->fullTitle ?? $course->title ?? ('Course '.$course->id),
                'product_category' => $course->category ?? 'Online Course',
                'product_profile' => 'service',
                // SSLCommerz requires city and address fields; provide defaults if missing
                'cus_add1' => $user->address ?? optional($user->profile)->address ?? '',
                'cus_city' => $user->city ?? optional($user->profile)->city ?? 'Dhaka',
                'cus_postcode' => $user->postcode ?? optional($user->profile)->postcode ?? '1207',
                'cus_country' => 'Bangladesh',
                // Ensure phone is non-empty for sandbox; default to a placeholder numeric string if missing
                'cus_phone' => $user->phone ?? optional($user->profile)->phone ?? '01234567890',
                // Shipping fields: set shipping_method to NO for digital/non-shippable products
                'shipping_method' => 'NO',
                'ship_name' => $user->name ?? 'Customer',
                'ship_add1' => $user->address ?? optional($user->profile)->address ?? '',
                'ship_city' => $user->city ?? optional($user->profile)->city ?? 'Dhaka',
                'ship_postcode' => $user->postcode ?? optional($user->profile)->postcode ?? '1207',
                'ship_country' => 'Bangladesh',
                'value_a' => $user->id,
                'value_b' => $course->id,
            ];

            try {
                $resp = Http::asForm()->post($apiUrl, $payload);
                $json = $resp->json();

                if (!empty($json['GatewayPageURL'])) {
                    // Ensure we return a valid gateway URL
                    return response()->json(['message' => 'Redirecting to gateway', 'redirect_url' => $json['GatewayPageURL'], 'payment' => $payment]);
                }

                // If no GatewayPageURL, record raw response and fall back
                $payment->raw_response = json_encode($json);
                $payment->save();
                logger()->warning('SSLCommerz response did not include GatewayPageURL: '.json_encode($json));
            } catch (\Exception $e) {
                logger()->error('SSLCommerz initiation failed: '.$e->getMessage());
            }
        }

        // Fallback: return a simulated redirect URL pointing back to this app
        $appUrl = config('app.url') ?: $request->getSchemeAndHttpHost();
        if (empty($appUrl)) {
            // as a last resort, use localhost:8000 which is the default development server
            $appUrl = 'http://localhost:8000';
        }
        $redirect = rtrim($appUrl, '/') . '/api/sslcommerz/redirect/' . $tran;

        return response()->json(['message' => 'Using simulated gateway redirect', 'redirect_url' => $redirect, 'payment' => $payment]);
    }

    // Simple gateway simulation page (public) to allow manual testing
    public function gatewayRedirect($tran)
    {
        // In production this would be the external gateway; here we simulate
        $html = "
        <html>
        <head>
            <title>Simulated SSLCommerz</title>
            <style>
                body {
                    background: #111;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    font-family: system-ui, -apple-system, sans-serif;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    text-align: center;
                    max-width: 500px;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                p {
                    color: #999;
                    margin-bottom: 30px;
                }
                .buttons {
                    display: flex;
                    gap: 10px;
                    flex-direction: column;
                }
                button {
                    padding: 14px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .success-btn {
                    background: #16a34a;
                    color: #000;
                }
                .success-btn:hover {
                    background: #15803d;
                }
                .fail-btn {
                    background: #dc2626;
                    color: #fff;
                }
                .fail-btn:hover {
                    background: #b91c1c;
                }
                .cancel-btn {
                    background: #6b7280;
                    color: #fff;
                }
                .cancel-btn:hover {
                    background: #4b5563;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <h1>🔐 Simulated SSLCommerz Gateway</h1>
                <p>Transaction: <strong>{$tran}</strong></p>
                <p style='font-size: 14px; color: #666;'>This is a simulated payment gateway for testing purposes.</p>
                <div class='buttons'>
                    <form method='POST' action='/api/sslcommerz/callback/{$tran}'>
                        <input type='hidden' name='status' value='VALID'>
                        <input type='hidden' name='tran_id' value='{$tran}'>
                        <input type='hidden' name='val_id' value='sim_".uniqid()."'>
                        <button type='submit' class='success-btn'>✓ Simulate Successful Payment</button>
                    </form>
                    <form method='POST' action='/api/sslcommerz/callback/{$tran}'>
                        <input type='hidden' name='status' value='FAILED'>
                        <input type='hidden' name='tran_id' value='{$tran}'>
                        <button type='submit' class='fail-btn'>✗ Simulate Failed Payment</button>
                    </form>
                    <form method='POST' action='/api/sslcommerz/callback/{$tran}'>
                        <input type='hidden' name='status' value='CANCELLED'>
                        <input type='hidden' name='tran_id' value='{$tran}'>
                        <button type='submit' class='cancel-btn'>⊗ Simulate Cancelled Payment</button>
                    </form>
                </div>
            </div>
        </body>
        </html>";
        return response($html, 200)->header('Content-Type', 'text/html');
    }

    // Simple callback to mark payment completed (public POST)
    public function callback(Request $request, $tran)
    {
        $p = Payment::where('tran_id', $tran)->first();
        if (! $p) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        // Get the status from SSLCommerz callback parameters
        // SSLCommerz sends different parameters based on success/fail/cancel
        $status = $request->input('status'); // Can be: VALID, FAILED, CANCELLED
        $valId = $request->input('val_id');
        $cardType = $request->input('card_type');
        $storeAmount = $request->input('store_amount');
        $bankTxnId = $request->input('bank_tran_id');
        
        // Store raw response for debugging
        $p->raw_response = json_encode($request->all());
        
        // Determine payment status based on callback data
        if ($status === 'VALID' || $status === 'VALIDATED') {
            // Payment was successful
            $p->status = 'completed';
        } elseif ($status === 'FAILED') {
            // Payment failed
            $p->status = 'failed';
            $p->save();
            
            // Redirect to failure page
            $frontendUrl = env('FRONTEND_URL') ?: config('app.url') ?: $request->getSchemeAndHttpHost();
            $frontendFail = rtrim($frontendUrl, '/') . '/payment/failed/' . $tran;
            
            if (! $request->expectsJson()) {
                return redirect($frontendFail);
            }
            return response()->json(['message' => 'Payment failed', 'payment' => $p]);
        } elseif ($status === 'CANCELLED') {
            // Payment was cancelled by user
            $p->status = 'cancelled';
            $p->save();
            
            // Redirect to cancel page
            $frontendUrl = env('FRONTEND_URL') ?: config('app.url') ?: $request->getSchemeAndHttpHost();
            $frontendCancel = rtrim($frontendUrl, '/') . '/payment/cancelled/' . $tran;
            
            if (! $request->expectsJson()) {
                return redirect($frontendCancel);
            }
            return response()->json(['message' => 'Payment cancelled', 'payment' => $p]);
        } else {
            // Unknown status - mark as pending for manual review
            $p->status = 'pending';
            $p->save();
            
            return response()->json(['message' => 'Payment status unknown', 'payment' => $p], 400);
        }
        
        $p->save();

        // ONLY enroll the user if payment was successful (status = completed)
        if ($p->status === 'completed') {
            try {
                $user = User::find($p->user_id);
                if ($user) {
                    // create a dedicated enrollment record
                    // Create enrollment if not exists (avoid duplicates)
                    try {
                        $enrollment = Enrollment::firstOrCreate(
                            ['user_id' => $p->user_id, 'course_id' => $p->course_id],
                            ['payment_id' => $p->id, 'enrolled_at' => now(), 'status' => 'active']
                        );

                        // If the enrollment was just created (fresh timestamp equals now within a small window), treat as new
                        $wasRecentlyCreated = isset($enrollment->wasRecentlyCreated) ? $enrollment->wasRecentlyCreated : false;

                        // Also keep the legacy single-course assignment for compatibility
                        if (empty($user->course_id) || $user->course_id != $p->course_id) {
                            $user->course_id = $p->course_id;
                            $user->enrollment_date = now();
                            $user->save();
                        }

                        // increment enrolled_count on course only when enrollment was newly created
                        if ($wasRecentlyCreated) {
                            try {
                                $course = Course::find($p->course_id);
                                if ($course) {
                                    if (isset($course->enrolled_count)) {
                                        $course->enrolled_count = ($course->enrolled_count ?? 0) + 1;
                                        $course->save();
                                    }
                                }
                            } catch (\Exception $e) {
                                logger()->warning('Failed to increment course enrolled_count: '.$e->getMessage());
                            }
                        }
                    } catch (\Exception $e) {
                        logger()->warning('Failed to create or update enrollment record: '.$e->getMessage());
                    }
                }
            } catch (\Exception $e) {
                logger()->error('Failed to enroll user after payment: '.$e->getMessage());
            }
        }

        // If this callback was initiated by a browser POST, redirect to frontend success page
        $frontendUrl = env('FRONTEND_URL') ?: config('app.url') ?: $request->getSchemeAndHttpHost();
        $frontendSuccess = rtrim($frontendUrl, '/') . '/payment/success/' . $tran;

        if (! $request->expectsJson()) {
            return redirect($frontendSuccess);
        }

        return response()->json(['message' => 'Payment marked completed', 'payment' => $p]);
    }

    // Public: fetch payment by transaction id
    public function getPayment($tran)
    {
        $p = Payment::where('tran_id', $tran)->first();
        if (! $p) {
            return response()->json(['message' => 'Payment not found'], 404);
        }
        return response()->json(['payment' => $p]);
    }

    // Return payments for the authenticated user (student)
    public function listForUser(Request $request)
    {
        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $payments = Payment::where('user_id', $user->id)
            ->with(['course.instructor'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['payments' => $payments]);
    }
}
