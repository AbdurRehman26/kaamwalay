<?php

namespace App\Services\Payment\Providers\Interfaces;

use App\Models\Order;

interface PaymentProviderVerificationInterface
{
    public function verify(Order $order, string $paymentIntentId): bool;
}
