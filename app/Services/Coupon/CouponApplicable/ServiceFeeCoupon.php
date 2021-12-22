<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;

class ServiceFeeCoupon extends CouponApplicables implements CouponApplicableInterface
{
    public function getFixedDiscount(Coupon $coupon, Order|array $order): float
    {
        return $coupon->discount_value * array_sum(array_column($order['items'], 'quantity'));
    }

    public function getPercentageDiscount(Coupon $coupon, Order|array $order): float
    {
        $serviceFee = $this->getPaymentPlan($order['payment_plan']['id'])->price * array_sum(array_column($order['items'], 'quantity'));

        return (($coupon->discount_value * $serviceFee) / 100);
    }
}
