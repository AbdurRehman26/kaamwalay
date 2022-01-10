<?php

namespace App\Services\Payment;

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
use App\Services\Admin\OrderStatusHistoryService;
use App\Services\Payment\Providers\CollectorCoinService;
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
        'collector_coin' => CollectorCoinService::class,
    ];

    public function __construct(
        private OrderStatusHistoryService $orderStatusHistoryService
    ) {
    }

    public function charge(Order $order, array $optionalData = []): array
    {
        $this->hasProvider($order);

        if ($this->order->paymentMethod->isCollectorCoin()) {
            $params = ['paymentBlockChainNetworkId' => json_decode($order->firstOrderPayment->response, true)['network']];
        }

        $data = resolve($this->providers[
            $this->order->paymentMethod->code
        ], $params ?? [])->charge($this->order, $optionalData);

        if (! empty($data['message']) || ! empty($data['payment_intent'])) {
            return $data;
        }

        // This updates should only be done if the payment method is not Collector Coin
        if (! empty($data['success']) && !$this->order->paymentMethod->isCollectorCoin()) {
            $this->calculateAndSaveFee($order);
            $this->updateOrderStatus();
        }

        return $this->updateOrderPayment($data);
    }

    public function verify(Order $order, string $paymentIntentId): bool
    {
        $this->hasProvider($order);

        if ($this->order->paymentMethod->isCollectorCoin()) {
            $params = ['paymentBlockChainNetworkId' => json_decode($order->firstOrderPayment->response, true)['network']];

            // With this, we make sure that transaction coming from request matches the one in DB before marking anything as paid
            if (json_decode($order->firstOrderPayment->response, true)['txn_hash'] !== $paymentIntentId) {
                return false;
            }
        }

        $data = resolve($this->providers[
            $this->order->paymentMethod->code
        ], $params ?? [])->verify($this->order, $paymentIntentId);

        if ($data) {
            $this->calculateAndSaveFee($order);

            return $this->updateOrderStatus();
        }

        return $data;
    }

    // public function verifyCollectorCoin(Order $order): array
    // {
    //     $this->hasProvider($order);

    //     $collectorCoinService = new CollectorCoinService(
    //         json_decode($order->firstOrderPayment->response, true)['network']
    //     );

    //     $data = $collectorCoinService->verify($this->order);

    //     if ($data['status'] === 'success' && $this->order->orderStatus->id === OrderStatus::PAYMENT_PENDING) {
    //         $this->updateOrderStatus();
    //     }

    //     return $data;
    // }

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

        if ($this->order->paymentMethod->isCollectorCoin()) {
            $params = ['paymentBlockChainNetworkId' => json_decode($order->firstOrderPayment->response, true)['network']];
        }

        $providerInstance = resolve($this->providers[
            $this->order->paymentMethod->code
        ], $params ?? []);

        $this->order->orderPayments->map(function (OrderPayment $orderPayment) use ($providerInstance) {
            $orderPayment->provider_fee = $providerInstance->calculateFee($orderPayment);
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
            'refund',
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
}
