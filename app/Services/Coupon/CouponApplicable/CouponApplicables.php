<?php

namespace App\Services\Coupon\CouponApplicable;

use App\Models\Order;
use App\Models\PaymentPlan;

class CouponApplicables
{
    protected function getPaymentPlan(array|Order $order): PaymentPlan
    {
        if (! empty($order['payment_plan']['id'])) {
            return PaymentPlan::find($order['payment_plan']['id']);
        }

        return $order->paymentPlan;
    }

    protected function getOrderItems(array|Order $order): array
    {
        if (! empty($order['items'])) {
            return $order['items'];
        }

        return $order->orderItems->toArray();
    }
}
