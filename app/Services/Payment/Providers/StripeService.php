<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Collection;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Charge;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\CardException;
use Stripe\Exception\InvalidRequestException;
use Stripe\PaymentIntent;
use Stripe\SetupIntent;

class StripeService implements PaymentProviderServiceInterface
{
    // stripe charges 2.9% x (amount) + 30cents
    public const STRIPE_FEE_PERCENTAGE = 0.029;
    public const STRIPE_FEE_ADDITIONAL_AMOUNT = 30;
    protected const ERROR_PARAMETER_CUSTOMER = 'customer';
    protected const ERROR_PARAMETER_PAYMENT_METHOD = 'payment_method';

    public function createSetupIntent(User $user): array | SetupIntent
    {
        try {
            return $user->createSetupIntent(['customer' => $user->stripe_id]);
        } catch (InvalidRequestException $e) {
            if ($this->isCustomerInvalid($e->getStripeParam())) {
                $this->handleInvalidCustomer($user);

                return $this->createSetupIntent($user);
            }
        }

        return [];
    }

    public function getUserPaymentMethods(User $user): array | Collection
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
            'amount' => $order->grand_total_cents,
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
        } catch (InvalidRequestException $exception) {
            if ($this->isPaymentMethodInvalid($exception->getStripeParam())) {
                return ['message' => 'Invalid Payment Method, please select a valid Payment Method.'];
            }
        } catch (CardException $exception) {
            return ['message' => $exception->getMessage()];
        }

        return ['message' => 'Unable to handle your request at the moment.'];
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

    protected function validateOrderIsPaid(Order $order, PaymentIntent $paymentIntent): bool
    {
        /** @var Charge $charge */
        $charge = $paymentIntent->charges->first();

        if (
            $charge->amount === $order->grand_total_cents
            && $charge->outcome->type === 'authorized'
        ) {
            $order->orderPayment->update([
                'response' => json_encode($paymentIntent->toArray()),
            ]);

            return true;
        }

        return false;
    }

    public function calculateFee(Order $order): float
    {
        $amountCharged = $order->grand_total_cents;

        return round((
            (self::STRIPE_FEE_PERCENTAGE * $amountCharged) + self::STRIPE_FEE_ADDITIONAL_AMOUNT
        ) / 100, 2);
    }

    protected function isCustomerInvalid(string $param): bool
    {
        return $param === self::ERROR_PARAMETER_CUSTOMER;
    }

    protected function isPaymentMethodInvalid(string $param): bool
    {
        return $param === self::ERROR_PARAMETER_PAYMENT_METHOD;
    }

    public function createCustomerIfNull(User $user): void
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
    }

    protected function handleInvalidCustomer(User $user): void
    {
        $this->removeOldCustomerId($user);
        $this->createCustomerIfNull($user);
    }
}
