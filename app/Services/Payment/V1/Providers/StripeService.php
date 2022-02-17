<?php

namespace App\Services\Payment\V1\Providers;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\User;
use App\Services\Payment\V1\Providers\Contracts\PaymentProviderServiceInterface;
use App\Services\Payment\V1\Providers\Contracts\PaymentProviderVerificationInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Charge;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\CardException;
use Stripe\Exception\InvalidRequestException;
use Stripe\PaymentIntent;
use Stripe\SetupIntent;

class StripeService implements PaymentProviderServiceInterface, PaymentProviderVerificationInterface
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
            $charge->amount === $this->getAmount($order)
            && $charge->outcome->type === 'authorized'
        ) {
            $order->lastOrderPayment->update([
                'response' => json_encode($paymentIntent->toArray()),
                'type' => OrderPayment::TYPE_ORDER_PAYMENT,
                'amount' => $order->grand_total_to_be_paid,
                'notes' => "Payment for Order # {$order->order_number}",
            ]);

            return true;
        }

        return false;
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

    public function calculateFee(OrderPayment $orderPayment): float
    {
        $amountCharged = $orderPayment->amount * 100;

        return round((
            (self::STRIPE_FEE_PERCENTAGE * $amountCharged) + self::STRIPE_FEE_ADDITIONAL_AMOUNT
        ) / 100, 2);
    }

    public function additionalCharge(Order $order, array $request): array
    {
        $paymentData = [
            'amount' => (int) $request['amount'] * 100,
            'payment_intent_id' => $order->firstOrderPayment->payment_provider_reference_id,
            'additional_data' => [
                'description' => $request['notes'],
                'metadata' => [
                    'Order ID' => $order->order_number,
                    'User Email' => $order->user->email,
                    'Type' => 'Extra Charge',
                ],
            ],
        ];

        try {
            $response = $order->user->charge(
                $paymentData['amount'],
                $paymentData['payment_intent_id'],
                $paymentData['additional_data']
            );

            return [
                'success' => true,
                'request' => $paymentData,
                'response' => $response->toArray(),
                'payment_provider_reference_id' => $paymentData['payment_intent_id'],
                'amount' => $request['amount'],
                'type' => OrderPayment::TYPE_EXTRA_CHARGE,
                'notes' => $paymentData['additional_data']['description'],
            ];
        } catch (IncompletePayment|InvalidRequestException|CardException $exception) {
            Log::error('Extra Charge failed', [
                'exception' => $exception->getMessage(),
                'amount' => $request['amount'],
                'Order #' => $order->order_number,
                'User Email' => $order->user->email,
            ]);

            return [];
        }
    }

    public function refund(Order $order, array $data): array
    {
        $orderPayment = $order->firstOrderPayment;
        $paymentData = json_decode($orderPayment->response, associative: true);

        $refundData = [
            'amount' => (int) $data['amount'] * 100,
            'metadata' => [
                'Order ID' => $order->id,
                'Order #' => $order->order_number,
                'Notes' => $data['notes'],
            ],
        ];

        try {
            $response = $order->user->refund($paymentData['id'], $refundData);
        } catch (\Exception $exception) {
            Log::error('Encountered error while refunding a charge with Stripe', [
                'message' => $exception->getMessage(),
                'data' => $refundData,
            ]);

            return [];
        }

        return [
            'success' => true,
            'request' => $refundData,
            'response' => $response->toArray(),
            'payment_provider_reference_id' => $response->id,
            'amount' => $data['amount'],
            'type' => OrderPayment::TYPE_REFUND,
            'notes' => $refundData['metadata']['Notes'],
        ];
    }

    protected function getAmount(Order $order): int
    {
        return $order->grand_total_cents;
    }
}
