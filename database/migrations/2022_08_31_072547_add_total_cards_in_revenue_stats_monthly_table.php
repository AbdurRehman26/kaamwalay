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
        Schema::table('revenue_stats_monthly', function (Blueprint $table) {
            $table->integer('total_cards')->nullable()->after('profit');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('revenue_stats_monthly', function (Blueprint $table) {
            $table->dropColumn('total_cards');
        });
    }
};
