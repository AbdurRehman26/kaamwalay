<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;

interface PaymentProviderServiceInterface
{
    public function charge(Order $order): array;

    public function verify(Order $order): bool;
}
