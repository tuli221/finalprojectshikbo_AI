<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'category',
        'description',
        'duration',
        'level',
        'type',
        'price',
        'discount_price',
        'lessons',
        'thumbnail',
        'instructor',
        'instructor_id',
        'instructor_profile_id',
        'status',
        'language',
        'requirements',
        'what_you_learn',
        'course_modules',
        'video_url',
        'certificate',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'duration' => 'integer',
        'enrolled_count' => 'integer',
        'certificate' => 'boolean',
    ];

    /**
     * Get the user (admin/instructor user) that created the course.
     */
    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Get the instructor profile for this course (for display on landing page).
     */
    public function instructorProfile()
    {
        return $this->belongsTo(Instructor::class, 'instructor_profile_id');
    }

    /**
     * Students enrolled in this course (many-to-many).
     */
    public function students()
    {
        return $this->belongsToMany(\App\Models\User::class, 'course_user')
            ->withTimestamps()
            ->withPivot(['enrolled_at', 'progress', 'completed']);
    }
}
