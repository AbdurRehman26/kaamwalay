<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderCustomerShipmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_customer_shipments', function (Blueprint $table) {
            $table->id();
            $table->timestamp('shipment_date')->nullable();
            $table->string('tracking_number');
            $table->string('tracking_url')->nullable();
            $table->string('shipping_provider');
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
        Schema::dropIfExists('order_customer_shipments');
    }
}
