<?php

namespace App\Services\Payment;

use App\Events\API\Customer\Order\OrderPaid;
use App\Exceptions\Services\Payment\PaymentMethodNotSupported;
use App\Models\Order;
use App\Services\Payment\Providers\PaypalService;
use App\Services\Payment\Providers\StripeService;
use JetBrains\PhpStorm\ArrayShape;

class PaymentService
{
    /**
     * Payment Providers available for the application
    **/
    protected array $providers = [
        'stripe' => StripeService::class,
        'paypal' => PaypalService::class,
    ];

    public function charge(Order $order): array
    {
        $data = resolve($this->providers[
            $order->paymentMethod->code
        ])->charge($order);

        if (! empty($data['error']) || ! empty($data['payment_intent'])) {
            return $data;
        }

        if (! empty($data['success'])) {
            $this->updateOrderStatus($order);
        }

        return $this->updateOrderPayment($order, $data);
    }

    public function verify(Order $order): bool
    {
        $data = resolve($this->providers[
            $order->paymentMethod->code
        ])->verify($order);

        if ($data) {
            return $this->updateOrderStatus();
        }

        return $data;
    }

    #[ArrayShape(['data' => "mixed"])] public function updateOrderPayment(Order $order, array $data): array
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
        // only update order if its status is in pending state this
        // method can be called twice and can fire event twice
        if ($order->isPayable()) {
            $order->markAsPlaced();

            OrderPaid::dispatch($order);
        }

        return true;
    }

    public function has($provider): self
    {
        throw_unless(array_key_exists($provider, $this->providers), PaymentMethodNotSupported::class);

        return $this;
    }
}
