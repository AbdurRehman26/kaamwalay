<?php

namespace App\Services\Payment;

use App\Events\API\Customer\Order\OrderPaid;
use App\Exceptions\Services\Payment\PaymentMethodNotSupported;
use App\Models\Order;
use App\Services\Payment\Providers\PaypalService;
use App\Services\Payment\Providers\StripeService;

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
        $this->hasProvider($order);

        $data = resolve($this->providers[
            $this->order->paymentMethod->code
        ])->charge($this->order);

        if (! empty($data['message']) || ! empty($data['payment_intent'])) {
            return $data;
        }

        if (! empty($data['success'])) {
            $this->updateOrderStatus();
            $this->calculateAndSaveFee($order);
        }

        return $this->updateOrderPayment($data);
    }

    public function verify(Order $order, string $paymentIntentId): bool
    {
        $this->hasProvider($order);

        $data = resolve($this->providers[
            $this->order->paymentMethod->code
        ])->verify($this->order, $paymentIntentId);

        if ($data) {
            $this->calculateAndSaveFee($order);

            return $this->updateOrderStatus();
        }

        return $data;
    }

    public function updateOrderPayment(array $data): array
    {
        $this->order->orderPayment->update([
            'request' => json_encode($data['request']),
            'response' => json_encode($data['response']),
            'payment_provider_reference_id' => $data['payment_provider_reference_id'],
        ]);

        return ['data' => $data['response']];
    }

    public function updateOrderStatus(): bool
    {
        // only update order if its status is in pending state this
        // method can be called twice and can fire event twice
        if ($this->order->isPayable()) {
            $this->order->markAsPlaced();

            OrderPaid::dispatch($this->order);
        }

        return true;
    }

    public function calculateAndSaveFee(Order $order): void
    {
        $this->hasProvider($order);

        $fee = resolve($this->providers[
            $this->order->paymentMethod->code
        ])->calculateFee($this->order);

        $orderPayment = $this->order->orderPayment;
        $orderPayment->provider_fee = $fee;
        $orderPayment->save();
    }

    public function hasProvider(Order $order): self
    {
        throw_unless(
            array_key_exists($order->paymentMethod->code, $this->providers),
            PaymentMethodNotSupported::class
        );
        $this->order = $order;

        return $this;
    }
}
