<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Services\Order\Shipping\ShippingFeeService;
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
        $totalDeclaredValue = array_sum(array_column($this->getOrderItems($order), 'declared_value_per_unit'));
        $totalNumberOfItems = array_sum(array_column($this->getOrderItems($order), 'quantity'));

        $insuredShipping = ShippingFeeService::calculate($totalDeclaredValue, $totalNumberOfItems);
        $serviceFee = $this->getPaymentPlan($order)->price * array_sum(array_column($this->getOrderItems($order), 'quantity'));
        
        return $serviceFee + $insuredShipping - $coupon->discount_value;
    }

    public function getPercentageDiscount(Coupon $coupon, Order|array $order): float
    {
        $serviceFee = $this->getPaymentPlan($order)->price * array_sum(array_column($this->getOrderItems($order), 'quantity'));

        return (($coupon->discount_value * $serviceFee) / 100);
    }
}
