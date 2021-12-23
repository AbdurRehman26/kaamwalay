<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;

class ServiceFeeCoupon extends CouponApplicables implements CouponApplicableInterface
{
    public function getFixedDiscount(Coupon $coupon, Order|array $order): float
    {
        $serviceFee = $this->getPaymentPlan($order)->price * array_sum(array_column($this->getOrderItems($order), 'quantity'));

        return min(($serviceFee - $coupon->discount_value), $serviceFee);
    }

    public function getPercentageDiscount(Coupon $coupon, Order|array $order): float
    {
        $serviceFee = $this->getPaymentPlan($order)->price * array_sum(array_column($this->getOrderItems($order), 'quantity'));

        return (($coupon->discount_value * $serviceFee) / 100);
    }
}
