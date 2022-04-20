<?php

namespace App\Services\Order\Shipping;

use App\Models\Order;
use App\Models\ShippingMethod;
use App\Services\Order\Shipping\Calculators\InsuredShippingFeeCalculator;
use App\Services\Order\Shipping\Calculators\VaultShippingFeeCalculator;

class ShippingFeeService
{
    public static function calculate(int $totalDeclaredValue, int $totalNumberOfItems): float
    {
        return InsuredShippingFeeCalculator::calculate($totalDeclaredValue, $totalNumberOfItems);
    }

    public static function calculateForOrder(Order $order): float
    {
        return match ($order->shippingMethod->code) {
            ShippingMethod::INSURED_SHIPPING => InsuredShippingFeeCalculator::calculateForOrder($order),
            default => VaultShippingFeeCalculator::calculateForOrder($order),
        };
    }
}
