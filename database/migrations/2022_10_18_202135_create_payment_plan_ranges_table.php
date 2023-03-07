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
        Schema::create('payment_plan_ranges', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('payment_plan_id');
            $table->foreign('payment_plan_id')->references('id')->on('payment_plans');

            $table->unsignedInteger('min_cards');
            $table->unsignedInteger('max_cards')->nullable();
            $table->decimal('price', 10, 2);

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
        Schema::dropIfExists('payment_plan_ranges');
    }
};
