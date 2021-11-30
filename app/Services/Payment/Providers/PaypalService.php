<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Support\Facades\Log;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\ProductionEnvironment;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Payments\CapturesRefundRequest;
use PayPalHttp\HttpException;

class PaypalService implements PaymentProviderServiceInterface
{
    protected SandboxEnvironment|ProductionEnvironment $environment;
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
                'type' => OrderPayment::TYPE_ORDER_PAYMENT,
            ];
        } catch (HttpException $e) {
            return ['message' => $e->getMessage()];
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

    protected function validateOrderIsPaid(Order $order, array $data): bool
    {
        if (! empty($data['purchase_units'][0]['payments']['captures'][0])) {
            $paymentIntent = $data['purchase_units'][0]['payments']['captures'][0];
            $captureStatus = $data['status'];

            if (
                $paymentIntent['amount']['value'] == $order->grand_total
                && $captureStatus === 'COMPLETED'
            ) {
                $order->lastOrderPayment->update([
                    'response' => json_encode($data),
                    'amount' => $order->grand_total,
                    'type' => OrderPayment::TYPE_ORDER_PAYMENT,
                    'notes' => "Pending Paypal Payment for " . $order->order_number,
                ]);

                return true;
            }
        }

        return false;
    }

    public function calculateFee(OrderPayment $orderPayment): float
    {
        $paymentResponse = json_decode($orderPayment->response, associative: true);
        if (! empty($paymentResponse['purchase_units'][0]['payments']['captures'][0])) {
            $breakdown = $paymentResponse['purchase_units'][0]['payments']['captures'][0]['seller_receivable_breakdown'];

            return $breakdown['paypal_fee']['value'];
        }

        return 0.0;
    }

    public function additionalCharge(Order $order, array $data): array
    {
        // Can not have extra charged with the payment flow we have right now. Added
        // this method so that it won't break the functionality and throws exception
        return [];
    }

    public function refund(Order $order, array $data): array
    {
        $orderPayment = $order->firstOrderPayment;
        $paymentData = json_decode($orderPayment->response, associative: true);

        $refundData = [
            'amount' => [
                'value' => $data['amount'],
                'currency_code' => 'USD',
            ],
            'note_to_payer' => $data['notes'],
        ];

        try {
            $refundRequest = new CapturesRefundRequest($paymentData['id']);
            $refundRequest->prefer('return=representation');
            $refundRequest->body = $refundData;

            $response = $this->client->execute($refundRequest);
        } catch (\Exception $exception) {
            Log::error('Encountered error while refunding a charge with Paypal', [
                'message' => $exception->getMessage(),
                'data' => $refundData,
            ]);

            return [];
        }

        return [
            'success' => true,
            'request' => $refundData,
            'response' => json_decode(json_encode($response->result), associative: true),
            'payment_provider_reference_id' => $paymentData['id'],
            'amount' => $data['amount']['value'],
            'type' => OrderPayment::TYPE_REFUND,
            'notes' => $refundData['note_to_payer'],
        ];
    }
}
