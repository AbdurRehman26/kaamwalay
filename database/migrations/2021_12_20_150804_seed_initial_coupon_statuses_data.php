<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SeedInitialCouponStatusesData extends Migration
{
    protected const TABLE = 'coupon_statuses';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::table(self::TABLE)->insert([
            [
                'code' => 'queued',
                'name' => 'Queued',
                'description' => 'Coupon status for future availability',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'active',
                'name' => 'Active',
                'description' => 'Coupon status for active coupon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'inactive',
                'name' => 'Inactive',
                'description' => 'Coupon status for inactive coupon',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'code' => 'expired',
                'name' => 'Expired',
                'description' => 'Coupon status for expired coupon',
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
