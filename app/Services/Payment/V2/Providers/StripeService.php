<?php

namespace App\Services\Payment\V2\Providers;

use App\Exceptions\Services\Payment\FailedPaymentException;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\User;
use App\Services\Payment\V1\Providers\StripeService as V1StripeService;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Charge;
use Stripe\Exception\CardException;
use Stripe\Exception\InvalidRequestException;
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

    /**
     * @throws FailedPaymentException
     */
    public function charge(Order $order, array $data = []): array
    {
        /** @var User $user */
        $user = auth()->user();

        $paymentData = [
            'amount' => $this->getAmount($order),
            'payment_intent_id' => $order->firstOrderPayment->payment_provider_reference_id,
            'additional_data' => [
                'description' => "Payment for Order # {$order->order_number}",
                'metadata' => [
                    'Order ID' => $order->id,
                    'User Email' => $order->user->email,
                    'Type' => 'Order Payment',
                ],
            ],
        ];

        try {
            $response = $user->charge(
                $paymentData['amount'],
                $paymentData['payment_intent_id'],
                $paymentData['additional_data']
            );

            return [
                'success' => true,
                'request' => $paymentData,
                'response' => $response->toArray(),
                'payment_provider_reference_id' => $order->firstOrderPayment->payment_provider_reference_id,
                'amount' => $order->grand_total_to_be_paid,
                'type' => OrderPayment::TYPE_ORDER_PAYMENT,
                'notes' => $paymentData['additional_data']['description'],
            ];
        } catch (IncompletePayment $exception) {
            return [
                'payment_intent' => $exception->payment,
            ];
        } catch (InvalidRequestException $exception) {
            if ($this->isPaymentMethodInvalid($exception->getStripeParam())) {
                throw new FailedPaymentException('Invalid Payment Method, please select a valid Payment Method.');
            }
        } catch (CardException $exception) {
            throw new FailedPaymentException($exception->getMessage());
        }

        throw new FailedPaymentException('Unable to handle your request at the moment.');
    }
}
