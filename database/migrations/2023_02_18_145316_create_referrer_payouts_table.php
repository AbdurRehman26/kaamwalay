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
        Schema::create('referrer_payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('payout_account');
            $table->string('payment_method');
            $table->decimal('amount', 10);
            $table->timestamp('initiated_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('response_payload')->nullable();
            $table->text('request_payload')->nullable();
            $table->foreignId('referrer_payout_status_id')->constrained();
            $table->foreignId('paid_by')->nullable()->constrained('users');
            $table->string('transaction_id')->nullable();
            $table->string('transaction_status')->nullable();
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
        Schema::dropIfExists('referrer_payouts');
    }
};