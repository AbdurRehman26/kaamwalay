<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;

class ServiceLevelCoupon implements CouponApplicableInterface
{
    public function calculateDiscount(Coupon $coupon, Order $order): float
    {
        dd($order->paymentPlan->price, $coupon);
        // TODO: Implement isCouponValid() method.
    }
}
