<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'course_id',
        'phone',
        'address',
        'enrollment_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Append computed attributes to model's array form.
     */
    protected $appends = [
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'otp_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * The course assigned to this student (nullable).
     */
    public function course()
    {
        return $this->belongsTo(\App\Models\Course::class, 'course_id');
    }

    /**
     * Computed status attribute.
     * - Non-students are considered active.
     * - Students without any assigned/purchased course are 'inactive'.
     */
    public function getStatusAttribute()
    {
        if ($this->role !== 'student') {
            return 'active';
        }

        // If a direct course_id exists, consider active
        if (! empty($this->course_id)) {
            return 'active';
        }

        // If there's a courses() relation (many-to-many), check existence
        if (method_exists($this, 'courses') && $this->courses()->exists()) {
            return 'active';
        }

        return 'inactive';
    }

    protected $dates = [
        'enrollment_date'
    ];
}
