<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('has_shipping_insurance')
                ->default(false)
                ->after('requires_cleaning')
                ->comment('Shows if Full Shipping Insurance has been selected');
            $table->decimal('shipping_insurance_fee', 10, 2)
                ->after('cleaning_fee')
                ->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'has_shipping_insurance',
                'shipping_insurance_fee',
            ]);
        });
    }
};
