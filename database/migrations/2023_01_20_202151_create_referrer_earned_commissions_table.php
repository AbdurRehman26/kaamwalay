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
        Schema::create('referrer_earned_commissions', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('referrer_id');
            $table->foreign('referrer_id')->references('id')->on('referrers');
            $table->unsignedBigInteger('order_id');
            $table->foreign('order_id')->references('id')->on('orders');
            $table->unsignedBigInteger('commission_structure_id');
            $table->foreign('commission_structure_id')->references('id')->on('commission_structures');
            $table->tinyInteger('type')->default(1)->comment('1 => Order Paid, 2 => Order Refunded, 3 => Extra Charge');
            $table->decimal('commission', 10)->default(0);

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
        Schema::dropIfExists('referrer_earned_commissions');
    }
};
