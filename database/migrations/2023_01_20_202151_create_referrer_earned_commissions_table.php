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

            $table->foreignId('referrer_id');
            $table->foreignId('order_id');
            $table->foreignId('commission_structure_id');
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
