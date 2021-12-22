<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\PaymentPlan;

class CouponApplicables
{
    public function calculateDiscount(Coupon $coupon, Order|array $order): float
    {
        return $order instanceof Order ? $this->calculateDiscountForOrder($coupon, $order) : $this->calculateDiscountForData($coupon, $order);
    }

    protected function calculateDiscountForOrder(Coupon $coupon, Order $order): float
    {
        return $this->getDiscountedAmount($coupon, $order);
    }

    protected function calculateDiscountForData(Coupon $coupon, array $orderData)
    {
        return $this->getDiscountedAmount($coupon, $orderData);
    }

    protected function getDiscountedAmount(Coupon $coupon, Order|array $order)
    {
        return match ($coupon->type) {
            'percentage' => $this->getPercentageDiscount($coupon, $order),
            default => $this->getFixedDiscount($coupon, $order),
        };
    }

    protected function getPaymentPlan(string $id): PaymentPlan
    {
        return PaymentPlan::find($id);
    }
}
