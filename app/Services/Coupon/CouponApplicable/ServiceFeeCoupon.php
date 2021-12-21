<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;

class ServiceFeeCoupon implements CouponApplicableInterface
{
    public function calculateDiscount(Coupon $coupon, Order $order): float
    {
        $serviceFee = $order->paymentPlan->price * array_sum(array_column($order->items, 'quantity'));

        return $this->getDiscountedAmount($coupon, $serviceFee);
    }

    protected function getDiscountedAmount(Coupon $coupon, $applyDiscountOnAmount)
    {
        return match ($coupon->type) {
            'fixed' => $applyDiscountOnAmount - $coupon->discount_value < 0 || $applyDiscountOnAmount - $coupon->discount_value > $applyDiscountOnAmount ? $applyDiscountOnAmount : (float) $coupon->discount_value,
            default => min(($coupon->discount_value * $applyDiscountOnAmount) / 100, $applyDiscountOnAmount),
        };
    }
}
