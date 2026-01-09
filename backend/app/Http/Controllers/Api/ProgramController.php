<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ProgramController extends Controller
{
    /**
     * Display a listing of programs (public)
     */
    public function index()
    {
        $programs = Program::where('is_active', true)->orderBy('id')->get();
        return response()->json($programs);
    }

    /**
     * Store a newly created program (admin only)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'image' => 'nullable', // can be file upload or string URL/base64
            'badge' => 'nullable|string|max:100',
            'features' => 'nullable', // allow array or JSON string
            'price_current' => 'nullable|string|max:50',
            'price_original' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // handle file upload if present
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('programs', 'public');
            // store absolute public URL for the frontend to consume
            $data['image'] = url(Storage::url($path));
        }

        // features may arrive as JSON string; normalize to array
        if (isset($data['features']) && is_string($data['features'])) {
            $decoded = json_decode($data['features'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $data['features'] = $decoded;
            }
        }

        $program = Program::create($data);

        return response()->json($program, 201);
    }

    /**
     * Display the specified program
     */
    public function show($id)
    {
        $program = Program::findOrFail($id);
        return response()->json($program);
    }

    /**
     * Update the specified program (admin only)
     */
    public function update(Request $request, $id)
    {
        $program = Program::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'image' => 'nullable',
            'badge' => 'nullable|string|max:100',
            'features' => 'nullable',
            'price_current' => 'nullable|string|max:50',
            'price_original' => 'nullable|string|max:50',
            'is_active' => 'sometimes|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('programs', 'public');
            $data['image'] = url(Storage::url($path));
        }

        if (isset($data['features']) && is_string($data['features'])) {
            $decoded = json_decode($data['features'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $data['features'] = $decoded;
            }
        }

        $program->update($data);

        return response()->json($program);
    }

    /**
     * Remove the specified program (admin only)
     */
    public function destroy($id)
    {
        $program = Program::findOrFail($id);
        $program->delete();
        
        return response()->json(['message' => 'Program deleted successfully'], 200);
    }
}
