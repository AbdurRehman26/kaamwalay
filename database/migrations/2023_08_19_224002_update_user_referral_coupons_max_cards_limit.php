<?php

use App\Models\CouponApplicable;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('coupons')->where([
            'is_system_generated' => 1,
            'coupon_applicable_id' => CouponApplicable::FOR_USERS,
        ])->update(['max_discount_applicable_items' => 20, 'updated_at' => now()]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('coupons')->where([
            'is_system_generated' => 1,
            'coupon_applicable_id' => CouponApplicable::FOR_USERS,
        ])->update(['max_discount_applicable_items' => null, 'updated_at' => now()]);
    }
};
