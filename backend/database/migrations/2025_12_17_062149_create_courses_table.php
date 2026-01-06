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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->text('description');

            $table->string('duration');
            $table->string('level');

            $table->integer('price');
            $table->integer('discount_price')->nullable();

            $table->integer('lessons')->default(0);
            $table->string('thumbnail')->nullable();

            $table->string('type')->nullable();

            $table->foreignId('instructor_id')->constrained('users');
            // Admin management additional fields moved here:
            if (!Schema::hasColumn('courses', 'instructor_profile_id')) {
                $table->foreignId('instructor_profile_id')->nullable()->constrained('instructors')->onDelete('set null');
            }
            if (!Schema::hasColumn('courses', 'language')) {
                $table->string('language')->default('English');
            }
            if (!Schema::hasColumn('courses', 'video_url')) {
                $table->string('video_url')->nullable();
            }
            if (!Schema::hasColumn('courses', 'certificate')) {
                $table->boolean('certificate')->default(true);
            }

            $table->string('status')->default('Draft'); // Draft | Published

            $table->integer('enrolled_count')->default(0);
            $table->float('rating')->default(0);
            $table->integer('revenue')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
