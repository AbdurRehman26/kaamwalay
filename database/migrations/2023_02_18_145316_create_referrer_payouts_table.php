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
            $table->string('email');
            $table->decimal('amount', 10);
            $table->timestamp('initiated_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('response_payload')->nullable();
            $table->text('request_payload')->nullable();
            $table->foreignId('payout_status_id')->constrained();
            $table->foreignId('paid_by_id')->constrained('users');
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
