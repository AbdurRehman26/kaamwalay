<?php

namespace App\Services\Order\Shipping\Calculators;

use App\Models\Order;

class VaultShippingFeeCalculator
{
    public static function calculateForOrder(Order $order): float
    {
        return 0.0;
    }

    public static function calculate(): float
    {
        return 0.0;
    }
}
