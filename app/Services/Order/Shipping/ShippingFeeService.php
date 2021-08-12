<?php

namespace App\Services\Order\Shipping;

use App\Models\Order;
use App\Services\Order\Shipping\Calculators\InsuredShippingFeeCalculator;

class ShippingFeeService
{
    public static function calculate(int $totalDeclaredValue, int $totalNumberOfItems): float
    {
        return InsuredShippingFeeCalculator::calculate($totalDeclaredValue, $totalNumberOfItems);
    }

    public static function calculateForOrder(Order $order): float
    {
        return InsuredShippingFeeCalculator::calculateForOrder($order);
    }
}
