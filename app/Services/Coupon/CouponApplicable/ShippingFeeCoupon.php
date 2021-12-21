<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;
use App\Services\Order\Shipping\ShippingFeeService;

class ShippingFeeCoupon extends CouponApplicables implements CouponApplicableInterface
{
    public function calculateDiscount(Coupon $coupon, Order $order): float
    {
        return $this->getDiscountedAmount($coupon, ShippingFeeService::calculateForDraftOrder($order));
    }
}
