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
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('shipping_order_address_id')->nullable()->change();
            $table->foreignId('billing_order_address_id')->nullable()->change();
            $table->foreignId('payment_method_id')->nullable()->change();
            $table->foreignId('shipping_method_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('shipping_order_address_id')->nullable(false)->change();
            $table->foreignId('billing_order_address_id')->nullable(false)->change();
            $table->foreignId('payment_method_id')->nullable(false)->change();
            $table->foreignId('shipping_method_id')->nullable(false)->change();
        });
    }
};
