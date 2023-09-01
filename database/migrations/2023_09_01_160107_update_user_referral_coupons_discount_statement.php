<?php

use App\Models\CouponApplicable;
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
        DB::table('coupons')->where([
            'is_system_generated' => 1,
            'coupon_applicable_id' => CouponApplicable::FOR_USERS,
        ])->update(['description' => 'Referral Discount (Applied to first 20 cards)', 'updated_at' => now()]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('coupons')->where([
            'is_system_generated' => 1,
            'coupon_applicable_id' => CouponApplicable::FOR_USERS,
        ])->update(['description' => null, 'updated_at' => now()]);
    }
};
