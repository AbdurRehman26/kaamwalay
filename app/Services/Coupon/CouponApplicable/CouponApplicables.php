<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\PaymentPlan;

trait CouponApplicables
{
    public function calculateDiscount(Coupon $coupon, Order|array $order): float
    {
        switch ($coupon->type) {
            case 'percentage':
                return $this->getPercentageDiscount($coupon, $order);
            default:
                return $this->getFixedDiscount($coupon, $order);
        }
    }

    public function getPaymentPlan(array|Order $order): PaymentPlan
    {
        if (! empty($order['payment_plan']['id'])) {
            return PaymentPlan::find($order['payment_plan']['id']);
        }

        return $order->paymentPlan;
    }

    public function getOrderItems(array|Order $order): array
    {
        if (! empty($order['items'])) {
            return $order['items'];
        }

        return $order->orderItems->toArray();
    }
}
