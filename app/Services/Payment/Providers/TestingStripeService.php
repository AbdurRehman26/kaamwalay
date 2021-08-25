<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Str;

class TestingStripeService implements PaymentProviderServiceInterface
{
    const CUSTOMER_ERROR_PARAMETER = 'customer';
    const PAYMENT_METHOD_ERROR_PARAMETER = 'payment_method';

    public function charge(Order $order): array
    {
        $paymentData = [
            'customer_id' => Str::random(25),
            'amount' => (int) ($order->grand_total * 100),
            'payment_intent_id' => $order->orderPayment->payment_provider_reference_id,
            'additional_data' => [
                'description' => "Payment for Order # {$order->id}",
                'metadata' => [
                    'Order ID' => $order->id,
                    'User Email' => $order->user->email,
                ],
            ],
        ];

        if ($paymentData['payment_intent_id'] === 'incomplete') {
            return [
                'payment_intent' => $this->incompletePaymentResponse($paymentData),
            ];
        }
        $response = $this->successfulPaymentResponse($paymentData);

        return [
            'success' => true,
            'request' => $paymentData,
            'response' => $response,
            'payment_provider_reference_id' => $order->orderPayment->payment_provider_reference_id,
        ];
    }

    public function verify(Order $order, string $paymentIntentId): bool
    {
        if ($paymentIntentId === 'incomplete') {
            return false;
        }

        $paymentIntent = $this->paidPaymentIntent($order);
//        dd((int) (100 * $order->grand_total),$paymentIntent );

        return $this->validateOrderIsPaid($order, $paymentIntent);
    }

    protected function successfulPaymentResponse(array $data): array
    {
        return [
            'id' => 'pi_3JPMybJCai8r8pbf0WsCQt1d',
            'object' => 'payment_intent',
            'amount' => $data['amount'],
            'amount_capturable' => 0,
            'amount_received' => $data['amount'],
            'application' => null,
            'application_fee_amount' => null,
            'canceled_at' => null,
            'cancellation_reason' => null,
            'capture_method' => 'automatic',
            'charges' => [
                'object' => 'list',
                'data' => [
                    [
                        'amount' => $data['amount'],
                        'amount_captured' => $data['amount'],
                        'calculated_statement_descriptor' => 'Test User PFA',
                        'captured' => true,
                        'created' => 1629186289,
                        'currency' => 'usd',
                        'customer' => $data['customer_id'],
                        'description' => $data['additional_data']['description'],
                        'metadata' => [
                            'Order ID' => $data['additional_data']['metadata']['Order ID'],
                            'User Email' => $data['additional_data']['metadata']['User Email'],
                        ],
                        'outcome' => [
                            'type' => 'authorized',
                        ],
                        'paid' => true,
                        'payment_intent' => $data['payment_intent_id'],
                        'payment_method' => 'pm_1JNQ1VJCai8r8pbffJQmzj7g',
                        'status' => 'succeeded',
                    ],
                ],
            ],
            'currency' => 'usd',
            'customer' => 'cus_K1Sq1o4TaJvMHX',
            'description' => $data['additional_data']['description'],
            'metadata' => [
                'Order ID' => '1',
                'User Email' => 'ruthie.bins@example.net',
            ],
        ];
    }

    protected function incompletePaymentResponse(array $data): array
    {
        return [
            'id' => $data['payment_intent_id'],
        ];
    }

    protected function paidPaymentIntent(Order $order): object
    {
        return (object) [
            "charges" => collect([
                (object) [
                    "id" => "ch_3JPMybJCai8r8pbf0PSZNf2Y",
                    "amount" => (int) ($order->grand_total * 100),
                    "amount_captured" => (int) ($order->grand_total * 100),
                    "outcome" => (object) [
                        "type" => "authorized",
                    ],
                    "paid" => true,
                ],
            ]),
        ];
    }

    protected function validateOrderIsPaid(Order $order, object $paymentIntent): bool
    {
        $charge = $paymentIntent->charges->first();
        if (
            $charge->amount === (int) ($order->grand_total * 100)
            && $charge->outcome->type === 'authorized'
        ) {
            $order->orderPayment->update([
                'response' => json_encode($paymentIntent),
            ]);

            return true;
        }

        return false;
    }

    public function createCustomerIfNull(User $user): void
    {
        if (! $user->hasStripeId()) {
            $user->stripe_id = Str::random(25);
            $user->save();
        }
    }

    protected function handleInvalidCustomer(User $user): void
    {
        $this->removeOldCustomerId($user);
        $this->createCustomerIfNull($user);
    }

    protected function removeOldCustomerId(User $user): void
    {
        $user->stripe_id = null;
    }

    protected function isPaymentMethodInvalid(string $param): bool
    {
        return $param === self::PAYMENT_METHOD_ERROR_PARAMETER;
    }

    protected function isCustomerInvalid(string $param): bool
    {
        return $param === self::CUSTOMER_ERROR_PARAMETER;
    }

    public function createSetupIntent(User $user): array
    {
        return [
            'client_secret' => Str::random(50),
            'customer' => $user->stripe_id,
            'object' => 'setup_intent',
        ];
    }

    public function getUserPaymentMethods(User $user): array
    {
        return [
            [
                'id' => Str::random(35),
                'customer' => $user->stripeId(),
                'object' => 'payment_method',
                'type' => 'card',
                'card' => [
                    'brand' => 'visa',
                    'country' => 'US',
                    'last4' => 4242,
                ],
            ],
        ];
    }
}
