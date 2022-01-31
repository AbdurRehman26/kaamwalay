<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Exceptions\API\Customer\Coupon\CouponCodeNotApplicable;
use App\Models\Coupon;
use App\Models\Order;
use App\Services\Order\Shipping\ShippingFeeService;

class ServiceFeeCoupon implements CouponApplicableInterface
{
    use CouponApplicables;

    public function getFixedDiscount(Coupon $coupon, Order|array $order): float
    {
        return $coupon->discount_value;
    }
    
    public function getFlatDiscount(Coupon $coupon, Order|array $order): float
    {
        $insuredShipping = ShippingFeeService::calculate(
            array_sum(array_column($this->getOrderItems($order), 'declared_value_per_unit')),
            array_sum(array_column($this->getOrderItems($order), 'quantity'))
        );
        $serviceFee = $this->getPaymentPlan($order)->price * array_sum(array_column($this->getOrderItems($order), 'quantity'));
        
        throw_if($coupon->discount_value > ($serviceFee + $insuredShipping), CouponCodeNotApplicable::class);

        return $serviceFee + $insuredShipping - $coupon->discount_value;
    }

    public function getPercentageDiscount(Coupon $coupon, Order|array $order): float
    {
        $serviceFee = $this->getPaymentPlan($order)->price * array_sum(array_column($this->getOrderItems($order), 'quantity'));

        return (($coupon->discount_value * $serviceFee) / 100);
    }
}
