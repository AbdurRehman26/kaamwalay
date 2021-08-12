<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;

interface PaymentProviderServiceInterface
{
    public function charge(Order $order);
}
