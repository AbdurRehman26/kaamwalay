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
        Schema::create('order_item_customer_shipments', function (Blueprint $table) {
            $table->id();
            $table->timestamp('shipment_date')->nullable();
            $table->string('tracking_number');
            $table->string('shipping_provider');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_item_customer_shipments');
    }
};
