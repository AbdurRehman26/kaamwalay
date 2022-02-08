<?php

namespace App\Services\Coupon;

use App\Exceptions\API\Customer\Coupon\CouponExpiredOrInvalid;
use App\Exceptions\API\Customer\Coupon\CouponUsageLimitReachedException;
use App\Models\Coupon;
use App\Models\CouponLog;
use App\Models\CouponStat;
use App\Models\Order;
use App\Services\Coupon\CouponApplicable\ServiceFeeCoupon;
use App\Services\Coupon\CouponApplicable\ServiceLevelCoupon;

class CouponService
{
    protected array $couponApplicables = [
        'service_level' => ServiceLevelCoupon::class,
        'service_fee' => ServiceFeeCoupon::class,
    ];

    public static function returnCouponIfValid(string $couponCode, array $couponParams = []): Coupon
    {
        $coupon = Coupon::whereCode($couponCode)->isActive()->validOnCouponable($couponParams)->select('coupons.*');

        throw_if($coupon->doesntExist(), CouponExpiredOrInvalid::class);
        throw_if($coupon->validForUserLimit($couponCode)->doesntExist(), CouponUsageLimitReachedException::class);

        return $coupon->first();
    }

    public function calculateDiscount(Coupon $coupon, array|Order $order): float
    {
        $couponApplication = resolve($this->couponApplicables[$coupon->couponApplicable->code]);

        return $couponApplication->calculateDiscount($coupon, $order);
    }

    public function updateCouponLogs(Order $order): void
    {
        CouponLog::create([
            'order_id' => $order->id,
            'user_id' => $order->user_id,
            'coupon_id' => $order->coupon->id,
        ]);
    }

    public function updateCouponStats(Coupon $coupon): void
    {
        $couponStat = CouponStat::updateOrCreate(['coupon_id' => $coupon->id]);
        $orderCouponLog = Order::join('coupon_logs', 'coupon_logs.order_id', 'orders.id')
                            ->where('orders.coupon_id', $coupon->id);

        $couponStat->times_used = CouponLog::whereCouponId($coupon->id)->count();
        $couponStat->total_revenue = $orderCouponLog->sum('grand_total');
        $couponStat->total_discount = $orderCouponLog->sum('discounted_amount');
        $couponStat->save();
    }
}
