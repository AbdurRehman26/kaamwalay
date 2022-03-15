<?php

namespace App\Services\Payment\V2\Providers;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Services\Payment\V1\Providers\PaypalService as V1PaypalService;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalHttp\HttpException;

class PaypalService extends V1PaypalService
{
    public function charge(Order $order, array $data = []): array
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

    protected function validateOrderIsPaid(Order $order, array $data): bool
    {
        if (! empty($data['purchase_units'][0]['payments']['captures'][0])) {
            $paymentIntent = $data['purchase_units'][0]['payments']['captures'][0];
            $captureStatus = $data['status'];

            if (
                $paymentIntent['amount']['value'] == $order->grand_total
                && $captureStatus === 'COMPLETED'
            ) {

                /*  Here we are updating the first order payment because in every case of order creation
                 *  (i.e Single, Partial) Paypal will be the primary payment method
                 *  hence it will be the first OrderPayment object.
                 */

                $order->firstOrderPayment->update([
                    'payment_provider_reference_id' => $data['purchase_units'][0]['payments']['captures'][0]['id'],
                    'response' => json_encode($data),
                    'amount' => $order->grand_total_to_be_paid,
                    'type' => OrderPayment::TYPE_ORDER_PAYMENT,
                    'notes' => 'Paypal Payment for ' . $order->order_number,
                ]);

                return true;
            }
        }

        return false;
    }
}
