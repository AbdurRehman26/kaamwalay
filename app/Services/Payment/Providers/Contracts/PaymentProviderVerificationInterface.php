<?php

namespace App\Services\Payment\Providers\Contracts;

use App\Models\Order;

interface PaymentProviderVerificationInterface
{
    public function verify(Order $order, string $paymentIntentId): bool;
}
