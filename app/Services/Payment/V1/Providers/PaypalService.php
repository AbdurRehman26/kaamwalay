<?php

namespace App\Services\Payment\V1\Providers;

use App\Http\APIClients\PaypalClient;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Services\Payment\V1\Providers\Contracts\PaymentProviderServiceInterface;
use App\Services\Payment\V1\Providers\Contracts\PaymentProviderVerificationInterface;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Log;

class PaypalService implements PaymentProviderServiceInterface, PaymentProviderVerificationInterface
{
    public function __construct(protected PaypalClient $client)
    {
    }

    public function charge(Order $order, array $data = []): array
    {
        try {
            $requestData = [
                "intent" => "CAPTURE",
                "purchase_units" => [[
                    "reference_id" => $order->order_number,
                    "amount" => [
                        "value" => $order->grand_total_to_be_paid,
                        "currency_code" => "USD",
                    ],
                ]],
            ];
            $response = $this->client->createOrder($requestData);

            return [
                'request' => $requestData,
                'response' => json_decode(json_encode($response), associative: true),
                'payment_provider_reference_id' => $response['id'],
                'type' => OrderPayment::TYPE_ORDER_PAYMENT,
            ];
        } catch (RequestException $e) {
            return ['message' => $e->getMessage()];
        }
    }



    public function verify(Order $order, string $paymentIntentId): bool
    {
        try {
            $response = $this->client->captureOrder($paymentIntentId);

            return $this->validateOrderIsPaid($order, json_decode(json_encode($response), associative: true));
        } catch (RequestException $e) {
            dd($e);

            return false;
        }
    }

    protected function validateOrderIsPaid(Order $order, array $data): bool
    {
        if (! empty($data['purchase_units'][0]['payments']['captures'][0])) {
            $paymentIntent = $data['purchase_units'][0]['payments']['captures'][0];
            $captureStatus = $data['status'];

            if (
                $paymentIntent['amount']['value'] == $order->grand_total_to_be_paid
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

    public function calculateFee(OrderPayment $orderPayment): float
    {
        // TODO Fix why we do not receive seller_receivable_breakdown, hence unable to calculate fee
        $paymentResponse = json_decode($orderPayment->response, associative: true);
        if (! empty($paymentResponse['purchase_units'][0]['payments']['captures'][0]['seller_receivable_breakdown'])) {
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
            $response = $this->client->captureRefund(
                $paymentData['purchase_units'][0]['payments']['captures'][0]['id'],
                $refundData
            );
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
            'response' => json_decode(json_encode($response), associative: true),
            'payment_provider_reference_id' => $paymentData['id'],
            'amount' => $data['amount'],
            'type' => OrderPayment::TYPE_REFUND,
            'notes' => $refundData['note_to_payer'],
        ];
    }
}
