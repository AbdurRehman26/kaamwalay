<?php

namespace App\Services\Payment\V2\Providers\Contracts;

use App\Models\Order;

interface PaymentProviderHandshakeInterface
{
    public function processHandshake(Order $order): bool;
}
