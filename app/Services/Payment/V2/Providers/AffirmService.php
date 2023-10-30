<?php

namespace App\Services\Payment\V2\Providers;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\User;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;

class AffirmService extends StripeService
{
    public function charge(Order $order, array $data = []): array
    {
        /** @var User $user */
        $user = auth()->user();

        $paymentData = [
            'payment_method' => 'affirm',
            'payment_method_types[]' => 'affirm',
            'amount' => $this->getAmount($order),
            'additional_data' => [
                'description' => "Payment for Order # {$order->order_number}",
                'metadata' => [
                    'Order ID' => $order->id,
                    'User Email' => $order->user->email,
                    'Type' => 'Order Payment',
                ],
            ],
        ];

        $response = $user->createPayment($order->grand_total_cents, [
            'payment_method_types[]' => 'affirm',
        ]);

        $paymentData['payment_intent_id'] = $response->clientSecret();

        return [
            'payment_intent' => $paymentData['payment_intent_id'],
            'success' => true,
            'request' => $paymentData,
            'response' => $response->toArray(),
            'payment_provider_reference_id' => $paymentData['payment_intent_id'],
            'amount' => $order->grand_total_to_be_paid,
            'type' => OrderPayment::TYPE_ORDER_PAYMENT,
            'notes' => $paymentData['additional_data']['description'],
        ];
    }

    public function verify(Order $order, string $paymentIntentId): bool
    {
        if ($order->isPaid()) {
            return true;
        }

        /** @var User $user */
        $user = auth()->user();

        try {
            $paymentIntent = $user->stripe()->paymentIntents->retrieve($paymentIntentId);

            return $this->validateOrderIsPaid($order, $paymentIntent);
        } catch (ApiErrorException $e) {
            return false;
        }
    }

    protected function validateOrderIsPaid(Order $order, PaymentIntent $paymentIntent): bool
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
