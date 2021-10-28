<?php

namespace App\Services\Payment;

use App\Events\API\Customer\Order\OrderPaid;
use App\Exceptions\API\Admin\Order\FailedExtraCharge;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Exceptions\API\FeatureNotAvailable;
use App\Exceptions\Services\Payment\PaymentMethodNotSupported;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\OrderStatusHistoryService;
use App\Services\Payment\Providers\PaypalService;
use App\Services\Payment\Providers\StripeService;
use Throwable;

class PaymentService
{
    private Order $order;

    /**
     * Payment Providers available for the application
    **/
    protected array $providers = [
        'stripe' => StripeService::class,
        'paypal' => PaypalService::class,
    ];

    public function __construct(
        private OrderStatusHistoryService $orderStatusHistoryService
    ) {
    }

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
            $this->calculateAndSaveFee($order);
            $this->updateOrderStatus();
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
        /** @noinspection JsonEncodingApiUsageInspection */
        $this->order->firstOrderPayment->update([
            'request' => json_encode($data['request']),
            'response' => json_encode($data['response']),
            'payment_provider_reference_id' => $data['payment_provider_reference_id'],
            'amount' => $data['amount'] ?? $this->order->grand_total,
            'type' => $data['type'],
            'notes' => $data['notes'] ?? '',
        ]);

        return [
            'data' => $data['response'],
        ];
    }

    /**
     * @throws Throwable
     * @throws OrderStatusHistoryWasAlreadyAssigned
     */
    public function updateOrderStatus(): bool
    {
        // only update order if its status is in pending state this
        // method can be called twice and can fire event twice
        if ($this->order->isPayable()) {
            $this->orderStatusHistoryService->addStatusToOrder(OrderStatus::PLACED, $this->order);

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

        $orderPayment = $this->order->firstOrderPayment;
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

    /**
     * @throws Throwable
     */
    public function additionalCharge(Order $order, array $request): array
    {
        if (! $this->canProcessExtraCharge()) {
            throw new FeatureNotAvailable('Extra Charge service is not available at the moment.');
        }

        $this->hasProvider($order);

        $response = resolve($this->providers[
            $this->order->paymentMethod->code
        ])->additionalCharge($this->order, $request);

        if (empty($response)) {
            throw new FailedExtraCharge;
        }

        return $response;
    }

    /**
     * @throws Throwable
    */
    protected function canProcessExtraCharge(): bool
    {
        return config('robograding.feature_order_extra_charge_enabled') === true;
    }

    public function refund(Order $order, array $request): array
    {
        $this->hasProvider($order);

        return resolve($this->providers[
            $this->order->paymentMethod->code
        ])->refund($this->order, $request);
    }
}
