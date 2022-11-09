<?php

namespace App\Services\Coupon\V2\CouponApplicable;

use App\Exceptions\API\Customer\Coupon\CouponFlatValueDiscountGreaterThanOrder;
use App\Models\Coupon;
use App\Models\Order;

class ServiceFeeCoupon implements CouponApplicableInterface
{
    use CouponApplicables;

    public function getFixedDiscount(Coupon $coupon, Order|array $order): float
    {
        return $coupon->discount_value;
    }
    
    public function getFlatDiscount(Coupon $coupon, Order|array $order): float
    {
        $insuredShipping = $this->getShippingFee($order);
        $serviceFee = $this->getPaymentPlan($order)->price * array_sum(array_column($this->getOrderItems($order), 'quantity'));

        throw_if($coupon->discount_value > ($serviceFee + $insuredShipping), CouponFlatValueDiscountGreaterThanOrder::class);

        return $serviceFee + $insuredShipping - $coupon->discount_value;
    }

    public function getPercentageDiscount(Coupon $coupon, Order|array $order): float
    {
        $serviceFee = $this->getPaymentPlan($order)->price * array_sum(array_column($this->getOrderItems($order), 'quantity'));

        return (($coupon->discount_value * $serviceFee) / 100);
    }
}
