<?php

namespace App\Services\Payment\V1;

use App\Enums\Wallet\WalletTransactionReason;
use App\Events\API\Customer\Order\OrderPaid;
use App\Exceptions\API\Admin\Order\FailedExtraCharge;
use App\Exceptions\API\Admin\Order\FailedRefund;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Exceptions\API\FeatureNotAvailable;
use App\Exceptions\Services\Payment\PaymentMethodNotSupported;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\V1\OrderStatusHistoryService;
use App\Services\Payment\V1\Providers\CollectorCoinService;
use App\Services\Payment\V1\Providers\PaypalService;
use App\Services\Payment\V1\Providers\StripeService;
use App\Services\Payment\V1\Providers\WalletService;
use Throwable;

class PaymentService
{
    protected Order $order;

    /**
     * Payment Providers available for the application
    **/
    protected array $providers = [
        'stripe' => StripeService::class,
        'paypal' => PaypalService::class,
        'collector_coin' => CollectorCoinService::class,
        'wallet' => WalletService::class,
    ];

    public function __construct(
        private OrderStatusHistoryService $orderStatusHistoryService
    ) {
    }

    public function charge(Order $order, array $optionalData = []): array
    {
        $this->hasProvider($order);

        $data = resolve($this->providers[
            $this->order->paymentMethod->code
        ])->charge($this->order, $optionalData);

        if (! empty($data['message']) || ! empty($data['payment_intent'])) {
            return $data;
        }

        if (! empty($data['success'])) {
            /* Partial Payments */
            if ($this->checkForPartialPayment()) {
                $this->updatePartialPayment();
            }

            $this->calculateAndSaveFee($order);

            $this->updateOrderStatus();
        }

        return $this->updateOrderPayment($this->order->firstOrderPayment, $data);
    }

    public function verify(Order $order, string $paymentIntentId): bool
    {
        $this->hasProvider($order);

        $data = resolve($this->providers[
            $this->order->paymentMethod->code
        ])->verify($this->order, $paymentIntentId);

        if ($data) {
            /* Partial Payments */
            if ($this->checkForPartialPayment()) {
                $this->updatePartialPayment();
            }

            $this->calculateAndSaveFee($order);

            return $this->updateOrderStatus();
        }

        return $data;
    }

    public function processHandshake(Order $order): bool
    {
        $this->hasProvider($order);

        $data = resolve($this->providers[
            $this->order->paymentMethod->code
        ])->processHandshake($this->order);

        if ($data) {
            if ($this->checkForPartialPayment()) {
                $this->updatePartialPayment();
            }

            $this->calculateAndSaveFee($order);

            return $this->updateOrderStatus();
        }

        return $data;
    }

    public function updateOrderPayment(OrderPayment $orderPayment, array $data): array
    {
        $orderPayment->update([
            'request' => json_encode($data['request']),
            'response' => json_encode($data['response']),
            'payment_provider_reference_id' => $data['payment_provider_reference_id'],
            'amount' => $data['amount'] ?? $this->order->grand_total_to_be_paid,
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

            $this->order->markAsPaid();

            OrderPaid::dispatch($this->order);
        }

        return true;
    }

    public function calculateAndSaveFee(Order $order): void
    {
        $this->hasProvider($order);

        $providerInstance = resolve($this->providers[
            $this->order->paymentMethod->code
        ]);

        $this->order->orderPayments->map(function (OrderPayment $orderPayment) use ($providerInstance) {
            $orderPayment->provider_fee = $orderPayment->paymentMethod->isWallet() ? 0 : $providerInstance->calculateFee($orderPayment);
            $orderPayment->save();

            return $orderPayment;
        });
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

    /**
     * @throws FailedRefund
     */
    public function refund(Order $order, array $request, User $user, bool $returnInWallet): array
    {
        if ($returnInWallet) {
            return $this->refundToWallet($order, $request, $user);
        }

        $this->hasProvider($order);

        $refundResponse = resolve($this->providers[
            $this->order->paymentMethod->code
        ])->refund($this->order, $request);

        if (empty($refundResponse)) {
            throw new FailedRefund;
        }

        return $refundResponse;
    }

    protected function refundToWallet(Order $order, array $request, User $user): array
    {
        $order->user->wallet->makeTransaction(
            $request['amount'],
            WalletTransactionReason::REFUND,
            $user->id,
            $order
        );

        return [
            'success' => true,
            'request' => [],
            'response' => [],
            'payment_provider_reference_id' => null,
            'amount' => $request['amount'],
            'type' => OrderPayment::TYPE_REFUND,
            'notes' => $request['notes'],
        ];
    }

    protected function checkForPartialPayment(): bool
    {
        return ! $this->order->paymentMethod->isWallet() && $this->order->amount_paid_from_wallet > 0;
    }

    /**
     * @return void
     */
    protected function updatePartialPayment(): void
    {
        $partialPaymentResponse = resolve($this->providers['wallet'])->charge($this->order);

        $this->updateOrderPayment($this->order->lastOrderPayment, $partialPaymentResponse);
    }
}
