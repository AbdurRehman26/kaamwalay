<?php

namespace App\Services\Payment;

use App\Events\API\Customer\Order\OrderPaid;
use App\Models\Order;
use App\Services\Payment\Providers\PaypalService;
use App\Services\Payment\Providers\StripeService;

class PaymentService
{
    public function charge(Order $order)
    {
        switch ($order->paymentMethod->code) {
            case 'stripe': {
                $response = (new StripeService)->charge($order);
                if (! empty($response['success'])) {
                    $this->updateOrderPayment($order, $response);
                    $this->calculateAndSaveFee($order);

                    return array_merge($response, ['provider' => $order->paymentMethod->code]);
                }

                return $response;
            }
            case 'paypal': {
                $response = (new PaypalService)->charge($order);
                if (is_array($response)) {
                    $data = $this->updateOrderPayment($order, $response);

                    return array_merge($data, ['provider' => $order->paymentMethod->code]);
                }

                return $response;
            }
        }

        throw new \Exception('Payment provider did not match.');
    }

    public function verify(Order $order, string $paymentIntentId)
    {
        switch ($order->paymentMethod->code) {
            case 'stripe':
                return (new StripeService)->verify($order, $paymentIntentId);
            case 'paypal':
                return (new PaypalService)->verify($order, $paymentIntentId);
        }

        throw new \Exception('Payment provider did not match.');
    }

    public function updateOrderPayment(Order $order, array $data): array
    {
        $order->orderPayment->update([
            'request' => json_encode($data['request']),
            'response' => json_encode($data['response']),
            'payment_provider_reference_id' => $data['payment_provider_reference_id'],
        ]);

        return ['data' => $data['response']];
    }

    public function updateOrderStatus(Order $order): bool
    {
        $order->markAsPlaced();

//        OrderPaid::dispatch($order);

        return true;
    }

    public function calculateAndSaveFee(Order $order): void
    {
        $orderPayment = $order->orderPayment;
        $fee = match ($order->paymentMethod->code) {
            'stripe' => (new StripeService)->calculateFee($order->grand_total),
            'paypal' => (new PaypalService)->calculateFee($order),
        };
        $orderPayment->provider_fee = $fee;
        $orderPayment->save();
    }
}
