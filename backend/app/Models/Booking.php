<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'program_id',
        'slot_id',
        'slot_label',
        'name',
        'phone',
        'email',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }
}
