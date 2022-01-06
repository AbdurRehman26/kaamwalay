<?php

namespace App\Services\Payment\Providers\Interfaces;

use App\Models\OrderPayment;

interface PaymentProviderServiceFeeInterface
{
    public function calculateFee(OrderPayment $orderPayment): float;
}
