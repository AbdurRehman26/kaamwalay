<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SeedInitialCouponApplicablesData extends Migration
{
    const TABLE = 'coupon_applicables';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table(self::TABLE)->insert([
            [
                'code' => 'service_fee',
                'label' => 'Total Service Fee',
                'api_suffix' => null,
                'description' => 'Coupon code will be applied to total service fee value only',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'service_level',
                'label' => 'Select Service Levels',
                'api_suffix' => route('payment-plans.index', [], false),
                'description' => 'Coupon code will be applied to selected service levels only',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'user',
                'label' => 'Select Users',
                'api_suffix' => 'users',
                'description' => 'Coupon code will be applied to selected users only',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'shipping_fee',
                'label' => 'Total Shipping Fee',
                'api_suffix' => null,
                'description' => 'Coupon code will be applied to total shipping fee value only',
                'is_active' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::table(self::TABLE)->truncate();
    }
}
