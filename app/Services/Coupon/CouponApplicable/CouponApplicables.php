<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\PaymentPlan;
use App\Services\Order\Shipping\ShippingFeeService;
use Illuminate\Support\Facades\Cache;

trait CouponApplicables
{
    public function calculateDiscount(Coupon $coupon, Order|array $order): float
    {
        switch ($coupon->type) {
            case 'percentage':
                return $this->getPercentageDiscount($coupon, $order);
            case 'flat':
                return $this->getFlatDiscount($coupon, $order);
            default:
                return $this->getFixedDiscount($coupon, $order);
        }
    }

    public function getPaymentPlan(array|Order $order): PaymentPlan
    {
        if (! empty($order['payment_plan']['id'])) {
            return PaymentPlan::find($order['payment_plan']['id']);
        }

        return PaymentPlan::find($order->payment_plan_id);
    }

    public function getOrderItems(array|Order $order): array
    {
        if (! empty($order['items'])) {
            return $order['items'];
        }

        return $order->orderItems->toArray();
    }

    public function getShippingFee(Order|array $order): float
    {
        if ($order instanceof Order) {
            return $order->shipping_fee;
        }

        $user = request()->user();
        if (Cache::has('shippingFee-' . $user->id)) {
            return Cache::get('shippingFee-' . $user->id);
        }

        return ShippingFeeService::calculate(
            array_sum(array_column($this->getOrderItems($order), 'declared_value_per_unit')),
            array_sum(array_column($this->getOrderItems($order), 'quantity'))
        );
    }

}
