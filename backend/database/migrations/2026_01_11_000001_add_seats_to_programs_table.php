<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('programs') && ! Schema::hasColumn('programs', 'seats')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->integer('seats')->default(0)->after('is_active');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasTable('programs') && Schema::hasColumn('programs', 'seats')) {
            Schema::table('programs', function (Blueprint $table) {
                $table->dropColumn('seats');
            });
        }
    }
};
