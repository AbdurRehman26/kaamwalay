<?php

namespace App\Services\Payment\V1\Providers\Contracts;

use App\Models\Order;
use App\Models\OrderPayment;

interface PaymentProviderServiceInterface
{
    public function charge(Order $order, array $data = []): array;

    public function calculateFee(OrderPayment $orderPayment): float;
}