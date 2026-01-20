<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Course;

class SampleCoursesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create super admin
        $admin = User::firstWhere('email', 'afsana@gmail.com');
        if (! $admin) {
            $admin = User::create([
                'name' => 'Afsana',
                'email' => 'afsana@gmail.com',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]);
        }

        // Ensure an instructor user exists
        $instructor = User::firstWhere('email', 'instructor@example.com');
        if (! $instructor) {
            $instructor = User::create([
                'name' => 'Sample Instructor',
                'email' => 'instructor@example.com',
                'password' => bcrypt('password'),
                'role' => 'instructor'
            ]);
        }
    }
}
