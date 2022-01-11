<?php

namespace App\Services\Payment\Providers\Contracts;

use App\Models\Order;
use App\Models\OrderPayment;

interface PaymentProviderServiceInterface
{
    public function charge(Order $order): array;

    public function calculateFee(OrderPayment $orderPayment): float;
}
