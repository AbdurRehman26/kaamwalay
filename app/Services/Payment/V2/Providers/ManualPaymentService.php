<?php

namespace App\Services\Payment\V2\Providers;

use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Support\Facades\Auth;
use App\Services\Payment\V2\Providers\Contracts\PaymentProviderServiceInterface;

class ManualPaymentService implements PaymentProviderServiceInterface
{
    public function charge(Order $order, array $data = []): array
    {
        abort_unless(Auth::user()->isAdmin(), 403);

        return [
            'success' => true,
            'request' => [
                'order_number' => $order->order_number,
                'amount' => $order->grand_total_to_be_paid,
            ],
            'response' => ['processed' => true],
            'payment_provider_reference_id' => null,
            'amount' => $order->grand_total_to_be_paid,
            'type' => OrderPayment::TYPE_ORDER_PAYMENT,
            'notes' => "Manual Payment Received for Order # {$order->order_number}",
        ];
    }

    public function calculateFee(OrderPayment $orderPayment): float
    {
        return 0.0;
    }
}
