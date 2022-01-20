<?php

namespace App\Services\Payment\Providers\Contracts;

use App\Models\Order;

interface PaymentProviderHandshakeInterface
{
    public function processHandshake(Order $order): bool;
}
