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
        Schema::create('order_item_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_status_id')->constrained();
            $table->foreignId('order_item_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->text('notes')->nullable();

            $table->unique(['order_item_status_id','order_item_id'], 'order_item_status_histories_unique');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item_status_histories');
    }
};
