<?php

namespace App\Services\Order\Shipping;

use App\Models\Order;
use App\Services\Order\Shipping\Calculators\InsuredShippingFeeCalculator;

class ShippingFeeService
{
    public static function calculate(Order $order): float
    {
        return InsuredShippingFeeCalculator::calculate($order);
    }
}
