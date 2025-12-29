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
            if (!Schema::hasColumn('courses', 'instructor_id')) {
                // make nullable to avoid breaking existing rows
                $table->foreignId('instructor_id')->nullable()->constrained('users')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            if (Schema::hasColumn('courses', 'instructor_id')) {
                // drop foreign key if exists then drop column
                $sm = Schema::getConnection()->getDoctrineSchemaManager();
                $doctrineTable = $sm->listTableDetails('courses');
                if ($doctrineTable->hasForeignKey('courses_instructor_id_foreign')) {
                    $table->dropForeign('courses_instructor_id_foreign');
                }
                $table->dropColumn('instructor_id');
            }
        });
    }
};
