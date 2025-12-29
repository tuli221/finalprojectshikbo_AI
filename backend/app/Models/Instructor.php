<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'role',
        'company',
        'specialization',
        'expertise_tags',
        'bio',
        'image',
        'email',
        'phone',
        'age',
        'total_students',
        'total_courses',
        'rating',
        'total_reviews',
        'linkedin',
        'twitter',
        'website',
        'is_featured',
        'join_date',
        'status',
    ];

    protected $casts = [
        'total_students' => 'integer',
        'total_courses' => 'integer',
        'rating' => 'float',
        'total_reviews' => 'integer',
        'is_featured' => 'boolean',
        'age' => 'integer',
        'join_date' => 'date',
    ];

    /**
     * Get the courses for this instructor profile.
     */
    public function courses()
    {
        return $this->hasMany(Course::class, 'instructor_profile_id');
    }
}
