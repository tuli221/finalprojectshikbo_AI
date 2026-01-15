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

        // Create sample published courses
        $courses = [
            [
                'title' => 'AI Fundamentals',
                'category' => 'AI & ML',
                'description' => 'An introductory course on Artificial Intelligence and Machine Learning.',
                'duration' => '30 days',
                'level' => 'Beginner',
                'price' => 12000,
                'discount_price' => 9999,
                'lessons' => 12,
                'status' => 'Published',
                'instructor_id' => $instructor->id
            ],
            [
                'title' => 'Web Development with MERN',
                'category' => 'Web Development',
                'description' => 'Build modern web apps using MongoDB, Express, React and Node.',
                'duration' => '45 days',
                'level' => 'Intermediate',
                'price' => 15000,
                'discount_price' => 12999,
                'lessons' => 18,
                'status' => 'Published',
                'instructor_id' => $instructor->id
            ],
        ];

        foreach ($courses as $c) {
            Course::updateOrCreate([
                'title' => $c['title']
            ], $c);
        }
    }
}
