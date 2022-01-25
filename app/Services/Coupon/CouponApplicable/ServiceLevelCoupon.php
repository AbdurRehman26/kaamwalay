<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;

class ServiceLevelCoupon implements CouponApplicableInterface
{
    use CouponApplicables;

    public function getFixedDiscount(Coupon $coupon, Order|array $order): float
    {
        return ($coupon->discount_value) * array_sum(array_column($this->getOrderItems($order), 'quantity'));
    }

    public function getFlatDiscount(Coupon $coupon, Order|array $order): float
    {
        return ($coupon->discount_value) * array_sum(array_column($this->getOrderItems($order), 'quantity'));
    }

    public function getPercentageDiscount(Coupon $coupon, Order|array $order): float
    {
        $serviceFee = $this->getPaymentPlan($order)->price * array_sum(array_column($this->getOrderItems($order), 'quantity'));

        return (($coupon->discount_value * $serviceFee) / 100);
    }
}
