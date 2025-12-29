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
            // Add missing columns without 'after' clause to avoid dependencies
            if (!Schema::hasColumn('courses', 'lessons')) {
                $table->integer('lessons')->default(0);
            }
            if (!Schema::hasColumn('courses', 'discount_price')) {
                $table->integer('discount_price')->nullable();
            }
            if (!Schema::hasColumn('courses', 'enrolled_count')) {
                $table->integer('enrolled_count')->default(0);
            }
            if (!Schema::hasColumn('courses', 'rating')) {
                $table->float('rating')->default(0);
            }
            if (!Schema::hasColumn('courses', 'revenue')) {
                $table->integer('revenue')->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $columnsToCheck = ['lessons', 'discount_price', 'enrolled_count', 'rating', 'revenue'];
            foreach ($columnsToCheck as $column) {
                if (Schema::hasColumn('courses', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
