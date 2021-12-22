<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\PaymentPlan;

class CouponApplicables
{
    public function calculateDiscount(Coupon $coupon, Order|array $order): float
    {
        return match ($coupon->type) {
            'percentage' => $this->getPercentageDiscount($coupon, $order),
            default => $this->getFixedDiscount($coupon, $order),
        };
    }

    protected function getPaymentPlan(array|Order $order): PaymentPlan
    {
        if (! empty($order['payment_plan']['id'])) {
            return PaymentPlan::find($order['payment_plan']['id']);
        }

        return $order->paymentPlan;
    }

    protected function getOrderItems(array|Order $order)
    {
        if (! empty($order['items'])) {
            return $order['items'];
        }

        return $order->orderItems->toArray();
    }
}
