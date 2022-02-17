<?php

namespace App\Services\Payment\V2\Providers\Contracts;

use App\Models\Order;

interface PaymentProviderVerificationInterface
{
    public function verify(Order $order, string $paymentIntentId): bool;
}
