<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Services\Payment\Providers\PaypalService;
use App\Services\Payment\Providers\StripeService;

class PaymentService
{
    public function charge(Order $order)
    {
        switch ($order->paymentMethod->code) {
            case 'stripe':
                return (new StripeService)->charge($order);
        }

        throw new \Exception('Payment provider did not match.');
    }

    public function verify(Order $order, string $paymentIntentId)
    {
        switch ($order->paymentMethod->code) {
            case 'stripe':
                return (new StripeService)->verify($order, $paymentIntentId);
            case 'paypal':
                return (new PaypalService)->verify($order, $paymentIntentId);
        }

        throw new \Exception('Payment provider did not match.');
    }

    public function createOrder(Order $order): array
    {
        $data = (new PaypalService)->createOrder($order);
        if (is_array($data)) {
            $order->orderPayment->update([
                'request' => json_encode($data['request']),
                'response' => json_encode($data['response']),
                'payment_provider_reference_id' => $data['payment_provider_reference_id'],
            ]);

            return [
                'data' => $data['response'],
            ];
        }

        return [
            'error' => $data,
        ];
    }

    public function updateOrderStatus(Order $order): bool
    {
        $order->markAsPlaced();

        return true;
    }
}
