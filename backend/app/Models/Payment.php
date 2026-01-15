<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'tran_id', 'user_id', 'course_id', 'amount', 'currency', 'status', 'raw_response'
    ];

    public function course()
    {
        return $this->belongsTo(\App\Models\Course::class, 'course_id');
    }
}
