<?php

namespace App\Services\Payment\V2;

use App\Events\API\Customer\Order\OrderPaid;
use App\Exceptions\API\Admin\Order\FailedExtraCharge;
use App\Exceptions\API\Admin\Order\FailedRefund;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Exceptions\API\FeatureNotAvailable;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\User;
use App\Services\Payment\V1\PaymentService as V1PaymentService;

class PaymentService extends V1PaymentService
{
    public function updateOrderPayment(OrderPayment $orderPayment, array $data): array
    {
        $this->order->allPayments->each->update([
            'request' => json_encode($data['request']),
            'response' => json_encode($data['response']),
            'payment_provider_reference_id' => $data['payment_provider_reference_id'],
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
        // only update order if its still payable
        // method can be called twice and can fire event twice
        if ($this->order->isPayable()) {
            $this->order->update([
                'payment_status' => 1,
                'paid_at' => now(),
            ]);

            OrderPaid::dispatch($this->order);
        }

        return true;
    }

    public function additionalCharge(Order $order, array $request): array
    {
        if (! $this->canProcessExtraCharge()) {
            throw new FeatureNotAvailable('Extra Charge service is not available at the moment.');
        }

        if ($order->isPaid()) {
            $this->hasProvider($order);

            $response = resolve($this->providers[
                $this->order->paymentMethod->code
            ])->additionalCharge($this->order, $request);

            if (empty($response)) {
                throw new FailedExtraCharge;
            }

            return $response;
        }
        return [
            'success' => true,
            'request' => [],
            'response' => [],
            'payment_provider_reference_id' => null,
            'amount' => $request['amount'],
            'type' => OrderPayment::TYPE_EXTRA_CHARGE,
            'notes' => $request['notes'],
        ];
    }

    /**
     * @throws FailedRefund
     */
    public function refund(Order $order, array $request, User $user, bool $returnInWallet): array
    {
        if ($order->isPaid()) {
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
