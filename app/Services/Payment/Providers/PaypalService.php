<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalHttp\HttpException;

class PaypalService implements PaymentProviderServiceInterface
{
    protected SandboxEnvironment $environment;
    protected PayPalHttpClient $client;

    public function __construct()
    {
        $this->environment = new SandboxEnvironment(
            config('services.paypal.client_id'),
            config('services.paypal.client_secret'),
        );
        $this->client = new PayPalHttpClient($this->environment);
    }

    public function charge(Order $order)
    {
        //
    }

    public function createOrder(Order $order): array|string
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
                'response' => $response->result,
                'payment_provider_reference_id' => $response->result->id,
            ];
        } catch (HttpException $e) {
            return $e->getMessage();
        }
    }

    public function verify(Order $order, string $paypalOrderId): bool
    {
        $orderRequest = new OrdersCaptureRequest($paypalOrderId);
        $orderRequest->prefer('return=representation');
        try {
            $response = $this->client->execute($orderRequest);

            return $this->validateOrderIsPaid($order, $response->result);
        } catch (HttpException $e) {
            return false;
        }
    }

    public function validateOrderIsPaid(Order $order, array $data): bool
    {
        $paymentIntent = $data['purchase_units'][0]['payments']['captures'];
        if (
            $paymentIntent['amount']['value'] == $order->grand_total
            && $paymentIntent['status'] === 'COMPLETED'
        ) {
            $order->orderPayment->update([
                'response' => json_encode($data),
            ]);
            return true;
        }
        return false;
    }
}
