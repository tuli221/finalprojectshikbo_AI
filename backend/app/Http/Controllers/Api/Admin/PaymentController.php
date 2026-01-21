<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Get all payments for admin (Admin Payment Management View)
     * Route: GET /api/admin/payments
     * Action: Fetch all payment records with user and course information
     */
    public function index()
    {
        try {
            // Get all payment records with user and course relationships, ordered by creation date (newest first)
            $payments = Payment::with(['user', 'course'])
                ->orderBy('created_at', 'desc')
                ->get();
            return response()->json(['payments' => $payments]);
        } catch (\Exception $e) {
            return response()->json(['payments' => []]);
        }
    }
}
