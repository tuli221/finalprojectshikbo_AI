<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstructorRequest extends Model
{
    use HasFactory;

    protected $table = 'instructor_requests';

    protected $fillable = [
        'user_id', 'name', 'title', 'role', 'company', 'specialization', 'expertise_tags', 'bio', 'image', 'email', 'phone', 'age', 'linkedin', 'twitter', 'website', 'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
