<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
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

    public function createOrder(Order $order): JsonResponse
    {
        $orderRequest = new OrdersCreateRequest();
        $orderRequest->prefer('return=representation');
        $orderRequest->body = [
            "intent" => "CAPTURE",
            "purchase_units" => [[
                "reference_id" => "test_ref_id1",
                "amount" => [
                    "value" => "100.00",
                    "currency_code" => "USD",
                ],
            ]],
        ];
        try {
            // Call API with your client and get a response for your call
            $response = $this->client->execute($orderRequest);

            // If call returns body in response, you can get the deserialized version from the result attribute of the response
            return new JsonResponse([
                'success' => true,
                'data' => $response->result,
            ]);
        } catch (HttpException $e) {
            echo $e->statusCode;
            return new JsonResponse([
                'success' => false,
                'data' => $e->getMessage(),
            ], );
        }
    }
}
