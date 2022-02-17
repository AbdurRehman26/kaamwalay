<?php

namespace App\Services\Payment\V2;

use App\Events\API\Customer\Order\OrderPaid;
use App\Exceptions\API\Admin\OrderStatusHistoryWasAlreadyAssigned;
use App\Models\OrderPayment;
use App\Services\Payment\V1\PaymentService as V1PaymentService;

class PaymentService extends V1PaymentService
{
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
}
