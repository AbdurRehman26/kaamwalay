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
    public function up(): void
    {
        Schema::create('referrers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id');
            $table->string('referral_code')->unique();
            $table->decimal('withdrawable_commission', 8, 2)->default(0);
            $table->unsignedInteger('link_clicks')->default(0);
            $table->unsignedInteger('successful_signups')->default(0);
            $table->unsignedInteger('referral_orders')->default(0)->comment('The total amount of paid orders done by referred users');
            $table->boolean('is_referral_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('referrers');
    }
};
