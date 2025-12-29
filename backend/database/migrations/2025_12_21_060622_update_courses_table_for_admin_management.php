<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Add instructor profile ID reference (different from user instructor_id)
            if (!Schema::hasColumn('courses', 'instructor_profile_id')) {
                $table->foreignId('instructor_profile_id')->nullable()->constrained('instructors')->onDelete('set null');
            }
            
            // Add more course details
            if (!Schema::hasColumn('courses', 'language')) {
                $table->string('language')->default('English');
            }
            if (!Schema::hasColumn('courses', 'requirements')) {
                $table->text('requirements')->nullable();
            }
            if (!Schema::hasColumn('courses', 'what_you_learn')) {
                $table->text('what_you_learn')->nullable(); // JSON or text
            }
            if (!Schema::hasColumn('courses', 'course_modules')) {
                $table->text('course_modules')->nullable(); // JSON
            }
            if (!Schema::hasColumn('courses', 'video_url')) {
                $table->string('video_url')->nullable();
            }
            if (!Schema::hasColumn('courses', 'certificate')) {
                $table->boolean('certificate')->default(true);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $columns = ['instructor_profile_id', 'language', 'requirements', 'what_you_learn', 'course_modules', 'video_url', 'certificate'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('courses', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
