<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseInformation extends Model
{
    use HasFactory;

    protected $table = 'course_information';

    protected $fillable = [
        'course_id',
        'about_course',
        'what_you_learn',
        'modules',
    ];

    protected $casts = [
        'modules' => 'array', // Automatically cast JSON to array
    ];

    /**
     * Get the course that owns the course information.
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
