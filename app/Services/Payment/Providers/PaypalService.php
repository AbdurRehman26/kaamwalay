<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\ProductionEnvironment;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalHttp\HttpException;

class PaypalService implements PaymentProviderServiceInterface
{
    protected $environment;
    protected PayPalHttpClient $client;

    public function __construct()
    {
        if (app()->environment(['local', 'staging'])) {
            $this->environment = new SandboxEnvironment(
                config('services.paypal.client_id'),
                config('services.paypal.client_secret'),
            );
        } else {
            $this->environment = new ProductionEnvironment(
                config('services.paypal.client_id'),
                config('services.paypal.client_secret'),
            );
        }
        $this->client = new PayPalHttpClient($this->environment);
    }

    public function charge(Order $order): array
    {
        $orderRequest = new OrdersCreateRequest();
        $orderRequest->prefer('return=representation');
        $requestData = [
            "intent" => "CAPTURE",
            "purchase_units" => [[
                "reference_id" => $order->order_number,
                "amount" => [
                    "value" => $order->grand_total,
                    "currency_code" => "USD",
                ],
            ]],
        ];

        $orderRequest->body = $requestData;

        try {
            $response = $this->client->execute($orderRequest);

            return [
                'request' => $requestData,
                'response' => json_decode(json_encode($response->result), associative: true),
                'payment_provider_reference_id' => $response->result->id,
            ];
        } catch (HttpException $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function verify(Order $order, string $paymentIntentId): bool
    {
        $orderRequest = new OrdersCaptureRequest($paymentIntentId);
        $orderRequest->prefer('return=representation');

        try {
            $response = $this->client->execute($orderRequest);

            return $this->validateOrderIsPaid($order, json_decode(json_encode($response->result), associative: true));
        } catch (HttpException $e) {
            return false;
        }
    }

    public function validateOrderIsPaid(Order $order, array $data): bool
    {
        if (! empty($data['purchase_units'][0]['payments']['captures'][0])) {
            $paymentIntent = $data['purchase_units'][0]['payments']['captures'][0];
            $captureStatus = $data['status'];

            if (
                $paymentIntent['amount']['value'] == $order->grand_total
                && $captureStatus === 'COMPLETED'
            ) {
                $order->orderPayment->update([
                    'response' => json_encode($data),
                ]);

                return true;
            }
        }

        return false;
    }

    public function calculateFee(Order $order): float | null
    {
        $paymentResponse = json_decode($order->orderPayment->response, associative: true);
        if (! empty($paymentResponse['purchase_units'][0]['payments']['captures'][0])) {
            $breakdown = $paymentResponse['purchase_units'][0]['payments']['captures'][0]['seller_receivable_breakdown'];

            return $breakdown['paypal_fee']['value'];
        }

        return null;
    }
}
