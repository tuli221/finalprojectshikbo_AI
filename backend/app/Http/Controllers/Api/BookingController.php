<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Program;
use App\Mail\BookingConfirmed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    public function index()
    {
        // return all bookings with program info, newest first
        $bookings = Booking::with('program')->orderBy('created_at', 'desc')->get();
        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'program_id' => 'required|exists:programs,id',
            'slot_id' => 'nullable|string',
            'slot_label' => 'nullable|string',
            'name' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
        ]);

        $program = Program::find($data['program_id']);

        // Check booking limit: maximum 25 students per program
        $currentBookingCount = Booking::where('program_id', $data['program_id'])->count();
        if ($currentBookingCount >= 25) {
            return response()->json([
                'message' => 'This program has no available slots. Please choose another program.',
                'limit_reached' => true
            ], 422);
        }

        // if slot_label not provided, map known slot ids to labels (fallback)
        if (empty($data['slot_label']) && !empty($data['slot_id'])) {
            $map = [
                'slot-1' => 'Feb 21, 2026, 12:00 PM',
            ];
            $data['slot_label'] = $map[$data['slot_id']] ?? null;
        }

        $booking = Booking::create($data);

        try {
            Mail::to($booking->email)->send(new BookingConfirmed($booking));
        } catch (\Exception $e) {
            // Log and continue — sending mail should not block booking creation
            logger()->error('Booking email failed: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Booking created', 'booking' => $booking], 201);
    }

    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();
        
        return response()->json(['message' => 'Booking deleted successfully']);
    }
}
