<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    protected const TABLE = 'coupon_applicables';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table(self::TABLE)->insert([
            [
                'code' => 'service_fee',
                'label' => 'Total Service Fee',
                'description' => 'Coupon code will be applied to total service fee value only',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'service_level',
                'label' => 'Select Service Levels',
                'description' => 'Coupon code will be applied to selected service levels only',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'user',
                'label' => 'Select Users',
                'description' => 'Coupon code will be applied to selected users only',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'shipping_fee',
                'label' => 'Total Shipping Fee',
                'description' => 'Coupon code will be applied to total shipping fee value only',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table(self::TABLE)->truncate();
    }
};
