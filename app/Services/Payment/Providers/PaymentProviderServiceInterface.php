<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use App\Models\OrderPayment;

interface PaymentProviderServiceInterface
{
    public function charge(Order $order, array $data = []): array;

    public function verify(Order $order, string $paymentIntentId): bool;

    public function calculateFee(OrderPayment $orderPayment): float;
}
