<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('referrers', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');

            $table->string('referral_code');
            $table->decimal('withdrawable_commission', 8, 2)->default(0);
            $table->unsignedInteger('link_clicks')->default(0);
            $table->unsignedInteger('successful_signups')->default(0);
            $table->unsignedInteger('commission_earnings')->default(0);
            $table->decimal('sales_total', 8, 2)->default(0);
            $table->decimal('total_earned', 8, 2)->default(0);
            $table->boolean('is_referral_active')->default(true);

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
        Schema::dropIfExists('referrers');
    }
};
