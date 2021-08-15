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
                    $data = $this->updateOrderPayment($order, $response);
                    $this->updateOrderStatus($order);
                    return $data;
                }

                return $response;
            }
            case 'paypal': {
                $response = (new PaypalService)->charge($order);
                if (empty($response['error'])) {
                    $data = $this->updateOrderPayment($order, $response);

                    return $data;
                }

                return $response;
            }
        }

        throw new \Exception('Payment provider did not match.');
    }

    public function verify(Order $order): bool
    {
        switch ($order->paymentMethod->code) {
            case 'stripe':
                return (new StripeService)->verify($order);
            case 'paypal': {
                $response = (new PaypalService)->verify($order);
                if ($response) {
                    $this->updateOrderStatus($order);
                }
                return $response;
            }
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
        // only update order if its status is in pending state
        if ($order->isPayable()) {
            $order->markAsPlaced();

            OrderPaid::dispatch($order);
        }

        return true;
    }
}
