<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique()->nullable();
            $table->decimal('shipping_amount', 10, 2)->nullable();
            $table->decimal('grand_total', 10, 2)->nullable();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('payment_plan_id')->constrained();
            $table->foreignId('order_status_id')->constrained();
            $table->foreignId('shipping_order_address_id')->constrained('order_addresses');
            $table->foreignId('billing_order_address_id')->constrained('order_addresses');
            $table->foreignId('payment_method_id')->constrained();
            $table->foreignId('shipping_method_id')->constrained();
            $table->foreignId('invoice_id')->nullable();
            $table->timestamp('arrived_at')->nullable();
            $table->timestamps();
        });

        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
