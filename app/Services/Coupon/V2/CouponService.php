<?php

namespace App\Services\Coupon\V2;

use App\Exceptions\API\Customer\Coupon\CouponExpiredOrInvalid;
use App\Exceptions\API\Customer\Coupon\CouponHasInvalidMinThreshold;
use App\Exceptions\API\Customer\Coupon\CouponUsageLimitReachedException;
use App\Models\Coupon;
use App\Models\CouponLog;
use App\Models\CouponStat;
use App\Models\Order;
use App\Services\Coupon\V2\CouponApplicable\ServiceFeeCoupon;
use App\Services\Coupon\V2\CouponApplicable\ServiceLevelCoupon;

class CouponService
{
    protected array $couponApplicables = [
        'service_level' => ServiceLevelCoupon::class,
        'service_fee' => ServiceFeeCoupon::class,
        'user' => ServiceFeeCoupon::class,
    ];

    public static function returnCouponIfValid(string $couponCode, array $couponParams = []): Coupon
    {
        $coupon = Coupon::whereCode($couponCode)->isActive()->validOnCouponable($couponParams)->select('coupons.*');

        throw_if($coupon->doesntExist(), CouponExpiredOrInvalid::class);
        throw_if($coupon->validForUserLimit($couponCode, auth()->user())->doesntExist(), CouponUsageLimitReachedException::class);

        $coupon = $coupon->first();
        throw_if($coupon->hasInvalidMinThreshold($couponParams['items_count'] ?? 0), CouponHasInvalidMinThreshold::class, $coupon->min_threshold_value);

        return $coupon;
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

        $totalCards = Order::join('order_items', 'order_items.order_id', 'orders.id')
        ->where('orders.coupon_id', $coupon->id)->sum('quantity');

        $couponStat->times_used = CouponLog::whereCouponId($coupon->id)->count();
        $couponStat->total_cards = $totalCards;
        $couponStat->total_revenue = $orderCouponLog->sum('grand_total');
        $couponStat->total_discount = $orderCouponLog->sum('discounted_amount');
        $couponStat->save();
    }

    public function removeCouponFromOrder(Order $order): bool
    {
        $order->discounted_amount = 0;
        $order->grand_total = $order->grand_total_before_discount;
        $order->coupon_id = null;

        return $order->save();
    }
}
