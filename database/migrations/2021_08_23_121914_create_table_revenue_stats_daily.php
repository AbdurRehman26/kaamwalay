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
    public function up(): void
    {
        Schema::create('revenue_stats_daily', function (Blueprint $table) {
            $table->id();
            $table->date('event_at');
            $table->decimal('revenue', 10, 2)->default(0);
            $table->decimal('profit', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('revenue_stats_daily');
    }
};
