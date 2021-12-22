<?php

namespace App\Services\Coupon;

use App\Exceptions\API\Customer\Coupon\CouponExpiredOrInvalid;
use App\Models\Coupon;
use App\Models\Order;
use App\Services\Coupon\CouponApplicable\ServiceFeeCoupon;
use App\Services\Coupon\CouponApplicable\ServiceLevelCoupon;

class CouponService
{
    protected $couponApplicables = [
        'service_level' => ServiceLevelCoupon::class,
        'service_fee' => ServiceFeeCoupon::class,
    ];

    public static function returnCouponIfValid(string $couponCode, array $couponParams = []): Coupon
    {
        $coupon = Coupon::whereCode($couponCode)->IsActive()->ValidOnCouponable($couponParams)->first();

        throw_if(! $coupon, CouponExpiredOrInvalid::class);

        return $coupon;
    }

    public function calculateDiscount(Coupon $coupon, array|Order $order): float
    {
        $couponApplication = resolve($this->couponApplicables[$coupon->couponApplicable->code]);

        return $couponApplication->calculateDiscount($coupon, $order);
    }

    public function updateCouponStats(Order $order)
    {
        $couponStat = \App\Models\CouponStat::updateOrCreate(['coupon_id' => $order->coupon_id]);
        $couponStat->increment('times_used_till_date');
        $couponStat->increment('total_discount_given', $order->discounted_amount);
    }

    public function updateCouponLogs(Order $order)
    {
        \App\Models\CouponLog::create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'coupon_id' => $order->coupon->id,
        ]);
    }
}
