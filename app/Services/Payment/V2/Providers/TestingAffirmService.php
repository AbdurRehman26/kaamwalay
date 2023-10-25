<?php

namespace App\Services\Payment\V2\Providers;

use App\Models\Order;
use App\Models\OrderPayment;
use Str;

class TestingAffirmService extends TestingStripeService
{
    public function charge(Order $order, array $data = []): array
    {
        $paymentData = [
            'customer_id' => Str::random(25),
            'amount' => $order->grand_total_cents,
            'payment_intent_id' => $order->firstOrderPayment->payment_provider_reference_id,
            'additional_data' => [
                'description' => "Payment for Order # {$order->order_number}",
                'metadata' => [
                    'Order ID' => $order->id,
                    'User Email' => $order->user->email,
                ],
                'expand' => ['latest_charge'],
            ],
        ];

        $response = $this->successfulPaymentResponse($paymentData);

        return [
            'payment_intent' => $response->id,
            'success' => true,
            'request' => $paymentData,
            'response' => (array) $response,
            'payment_provider_reference_id' => $paymentData['payment_intent_id'],
            'amount' => $order->grand_total_to_be_paid,
            'type' => OrderPayment::TYPE_ORDER_PAYMENT,
            'notes' => $paymentData['additional_data']['description'],
        ];
    }

    protected function paidPaymentIntent(Order $order): object
    {
        return (object) [
            'status' => 'succeeded',
            'amount' => $order->grand_total_cents,
        ];
    }

    protected function validateOrderIsPaid(Order $order, object $paymentIntent): bool
    {
        if ($paymentIntent->status === 'succeeded') {
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
}
