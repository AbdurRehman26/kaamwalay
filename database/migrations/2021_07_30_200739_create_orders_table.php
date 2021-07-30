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
            $table->string('order_number');
            $table->decimal('shipping_amount', 10, 2);
            $table->decimal('grand_total', 10, 2);
            $table->foreignId('user_id')->constrained();
            $table->foreignId('payment_plan_id')->constrained();
            $table->foreignId('order_status_id')->constrained();
            $table->foreignId('order_address_id')->constrained();
            $table->foreignId('payment_method_id')->constrained();
            $table->foreignId('shipping_method_id')->constrained();
            $table->foreignId('invoice_id')->constrained();
            $table->timestamp('arrived_at');
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
