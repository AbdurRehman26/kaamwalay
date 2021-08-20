<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Collection;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\InvalidRequestException;
use Stripe\PaymentIntent;

class StripeService implements PaymentProviderServiceInterface
{
    const CUSTOMER_ERROR_PARAMETER = 'customer';

    public function createSetupIntent(User $user): \Stripe\SetupIntent
    {
        try {
            return $user->createSetupIntent(['customer' => $user->stripe_id]);
        } catch (InvalidRequestException $e) {
            if ($this->isCustomerInvalid($e->getStripeParam())) {
                $this->handleInvalidCustomer($user);
                return $this->createSetupIntent($user);
            }
        }
    }

    public function getUserPaymentMethods(User $user): array|Collection
    {
        try {
            return $user->paymentMethods();
        } catch (InvalidRequestException $e) {
            if ($this->isCustomerInvalid($e->getStripeParam())) {
                $this->handleInvalidCustomer($user);
                return $this->getUserPaymentMethods($user);
            }
        }
        return [];
    }

    public function charge(Order $order): array
    {
        /** @var User $user */
        $user = auth()->user();

        $paymentData = [
            'amount' => $order->grand_total * 100,
            'payment_intent_id' => $order->orderPayment->payment_provider_reference_id,
            'additional_data' => [
                'description' => "Payment for Order # {$order->id}",
                'metadata' => [
                    'Order ID' => $order->id,
                    'User Email' => $order->user->email,
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
                'payment_provider_reference_id' => $order->orderPayment->payment_provider_reference_id,
            ];
        } catch (IncompletePayment $exception) {
            return [
                'payment_intent' => $exception->payment,
            ];
        }
    }

    public function verify(Order $order, string $paymentIntentId): bool
    {
        /** @var User $user */
        $user = auth()->user();

        try {
            $paymentIntent = $user->stripe()->paymentIntents->retrieve($paymentIntentId);

            return $this->validateOrderIsPaid($order, $paymentIntent);
        } catch (ApiErrorException $e) {
            return false;
        }
    }

    public function validateOrderIsPaid(Order $order, PaymentIntent $paymentIntent): bool
    {
        $charge = $paymentIntent->charges->first();
        if (
            $charge->amount === ($order->grand_total * 100)
            && $charge->outcome->type === 'authorized'
        ) {
            $order->orderPayment->update([
                'response' => json_encode($paymentIntent->toArray()),
            ]);

            return true;
        }

        return false;
    }

    protected function isCustomerInvalid(string $param): bool
    {
        return $param === self::CUSTOMER_ERROR_PARAMETER;
    }

    public function createCustomer(User $user): void
    {
        if (! $user->hasStripeId()) {
            $user->createAsStripeCustomer([
                'name' => $user->name,
                'email' => $user->email,
            ]);
        }
    }

    protected function removeOldCustomerId(User $user): void
    {
        $user->stripe_id = null;
        $user->save();
    }

    protected function handleInvalidCustomer(User $user): void
    {
        $this->removeOldCustomerId($user);
        $this->createCustomer($user);
    }
}
