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
        Schema::table('pop_reports_cards', function (Blueprint $table) {
            $table->string('population')
                ->storedAs("(`total` + `total_plus`)")
                ->index();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pop_reports_cards', function (Blueprint $table) {
            $table->dropColumn('population');
        });
    }
};
