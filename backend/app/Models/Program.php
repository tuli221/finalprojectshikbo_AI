<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image',
        'badge',
        'features',
        'price_current',
        'price_original',
        'is_active'
    ];

    protected $casts = [
        'features' => 'array',
        'is_active' => 'boolean'
    ];
}
