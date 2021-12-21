<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;

class ServiceFeeCoupon extends CouponApplicables implements CouponApplicableInterface
{
    public function calculateDiscount(Coupon $coupon, Order $order): float
    {
        $serviceFee = $order->paymentPlan->price * array_sum(array_column($order->items, 'quantity'));

        return $this->getDiscountedAmount($coupon, $serviceFee);
    }
}
