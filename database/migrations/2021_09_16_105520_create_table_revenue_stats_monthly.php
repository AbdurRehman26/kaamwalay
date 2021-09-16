<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableRevenueStatsMonthly extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('revenue_stats_monthly', function (Blueprint $table) {
            $table->id();
            $table->date('event_at');
            $table->decimal('monthly_revenue', 10, 2)->default(0);
            $table->decimal('monthly_profit', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('revenue_stats_monthly');
    }
}
