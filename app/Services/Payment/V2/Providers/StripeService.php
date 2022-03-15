<?php

namespace App\Services\Payment\V2\Providers;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Services\Payment\V1\Providers\StripeService as V1StripeService;
use Stripe\Charge;
use Stripe\PaymentIntent;

class StripeService extends V1StripeService
{
    protected function validateOrderIsPaid(Order $order, PaymentIntent $paymentIntent): bool
    {
        /** @var Charge $charge */
        $charge = $paymentIntent->charges->first();

        if (
            $charge->amount === $this->getAmount($order)
            && $charge->outcome->type === 'authorized'
        ) {
            $order->firstOrderPayment->update([
                'response' => json_encode($paymentIntent->toArray()),
                'type' => OrderPayment::TYPE_ORDER_PAYMENT,
                'amount' => $order->grand_total_to_be_paid,
                'notes' => "Payment for Order # {$order->order_number}",
            ]);

            return true;
        }

        return false;
    }

    protected function getAmount(Order $order): int
    {
        return (int) bcmul((string) $order->grand_total, (string) 100);
    }
}
