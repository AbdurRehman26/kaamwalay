<?php

namespace App\Services\Payment\V1\Providers\Contracts;

use App\Models\Order;

interface PaymentProviderHandshakeInterface
{
    public function processHandshake(Order $order): bool;
}
