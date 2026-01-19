<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'tran_id', 'user_id', 'course_id', 'amount', 'currency', 'status', 
        'student_name', 'student_email', 'student_phone', 'student_address',
        'raw_response'
    ];

    public function course()
    {
        return $this->belongsTo(\App\Models\Course::class, 'course_id');
    }
}
