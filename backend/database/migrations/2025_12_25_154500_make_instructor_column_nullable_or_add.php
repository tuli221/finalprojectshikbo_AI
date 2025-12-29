<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (!Schema::hasColumn('courses', 'instructor')) {
                // add nullable instructor column to avoid insert failures
                $table->string('instructor')->nullable();
            }
        });

        // If the column exists but is NOT NULL, alter it to be nullable using raw SQL
        if (Schema::hasColumn('courses', 'instructor')) {
            // Use ALTER TABLE to set nullable; this works without doctrine/dbal
            DB::statement("ALTER TABLE `courses` MODIFY `instructor` VARCHAR(255) NULL;");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Do not drop the column to avoid data loss. If you want to remove it, do it manually.
    }
};
