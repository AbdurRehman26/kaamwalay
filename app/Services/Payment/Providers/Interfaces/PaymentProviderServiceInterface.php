<?php

namespace App\Services\Payment\Providers\Interfaces;

use App\Models\Order;

interface PaymentProviderServiceInterface
{
    public function charge(Order $order): array;

    public function verify(Order $order, string $paymentIntentId): bool;
}
