<?php

namespace App\Services\Order\Shipping;

use App\Exceptions\API\Customer\Order\InvalidShippingMethodException;
use App\Models\Order;
use App\Models\ShippingMethod;
use App\Services\Order\Shipping\Calculators\InsuredShippingFeeCalculator;
use App\Services\Order\Shipping\Calculators\VaultShippingFeeCalculator;

class ShippingFeeService
{
    public static function calculate(int $totalDeclaredValue, int $totalNumberOfItems, ?ShippingMethod $shippingMethod = null): float
    {
        return match ($shippingMethod?->code) {
            ShippingMethod::VAULT_STORAGE => VaultShippingFeeCalculator::calculate(),
            default => InsuredShippingFeeCalculator::calculate($totalDeclaredValue, $totalNumberOfItems),
        };
    }

    /**
     * @throws InvalidShippingMethodException
     */
    public static function calculateForOrder(Order $order): float
    {
        return match ($order->shippingMethod->code) {
            ShippingMethod::INSURED_SHIPPING => InsuredShippingFeeCalculator::calculateForOrder($order),
            ShippingMethod::VAULT_STORAGE => VaultShippingFeeCalculator::calculateForOrder($order),
            default => throw new InvalidShippingMethodException,
        };
    }
}
