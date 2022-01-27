<?php

namespace App\Services\Payment;

use App\Models\Order;
use App\Models\OrderStatus;
use Carbon\Carbon;

class PaymentHandshakeService
{
    public function processHandshake(): void
    {
        $unpaidOrders = Order::where('order_status_id', OrderStatus::PAYMENT_PENDING)
            ->where('created_at', '>', Carbon::now()->subHours(2)->toDateTimeString())
            ->whereHas('paymentMethod', function ($query) {
                return $query->where('handles_handshake', 1);
            })->whereHas('orderPayments', function ($query) {
                return $query->whereNotNull('payment_provider_reference_id');
            })->get();

        if ($unpaidOrders->isEmpty()) {
            return;
        }

        $paymentService = resolve(PaymentService::class);

        $unpaidOrders->each(function (Order $order) use ($paymentService) {
            $paymentService->processHandshake($order);
        });
    }
}
