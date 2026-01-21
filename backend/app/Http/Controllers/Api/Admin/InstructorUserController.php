<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class InstructorUserController extends Controller
{
    /**
     * Get all users who have approved instructor profiles (Admin Instructor Users List)
     * Route: GET /api/admin/instructors/users
     * Action: Fetch all users with approved instructor status for assignment
     */
    public function getApprovedInstructorUsers()
    {
        // Get all users who have an instructor profile with 'Approved' status, ordered by name
        $users = User::whereHas('instructor', function($q) {
            $q->where('status', 'Approved');
        })
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role']);

        return response()->json($users);
    }
}
