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
        Schema::table('instructors', function (Blueprint $table) {
            // Add missing fields for instructor profiles
            $table->string('role')->nullable()->after('title'); // e.g., "Full-stack developer at"
            $table->string('company')->nullable()->after('role'); // e.g., "CODETREE"
            $table->string('expertise_tags')->nullable()->after('specialization'); // JSON or comma-separated
            $table->string('phone')->nullable()->after('email');
            $table->integer('age')->nullable()->after('phone');
            $table->date('join_date')->nullable()->after('age');
            $table->string('status')->default('Pending')->after('is_featured'); // Approved, Pending, Rejected
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('instructors', function (Blueprint $table) {
            $table->dropColumn(['role', 'company', 'expertise_tags', 'phone', 'age', 'join_date', 'status']);
        });
    }
};
