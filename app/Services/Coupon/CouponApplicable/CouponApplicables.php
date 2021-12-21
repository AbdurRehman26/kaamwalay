<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;

class CouponApplicables
{
    protected function getDiscountedAmount(Coupon $coupon, $applyDiscountOnAmount)
    {
        return match ($coupon->type) {
            'fixed' => $applyDiscountOnAmount - $coupon->discount_value < 0 || $applyDiscountOnAmount - $coupon->discount_value > $applyDiscountOnAmount ? $applyDiscountOnAmount : (float) $coupon->discount_value,
            default => min(($coupon->discount_value * $applyDiscountOnAmount) / 100, $applyDiscountOnAmount),
        };
    }
}
