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
        Schema::table('pop_reports_cards', function (Blueprint $table) {
            $table->integer('population')
                ->storedAs('(`total` + `total_plus`)')
                ->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pop_reports_cards', function (Blueprint $table) {
            $table->dropColumn('population');
        });
    }
};
