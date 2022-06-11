<?php

namespace App\Services\Order\Shipping\Calculators;

use App\Models\Country;
use App\Models\Order;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class InsuredShippingFeeCalculator
{
    public static function calculateForOrder(Order $order): float
    {
        return self::calculate(
            self::calculateTotalDeclaredValue($order->orderItems),
            self::calculateTotalNumberOfItems($order->orderItems),
            self::getShippingAddress($order),
        );
    }

    /**
     * @throws Exception
     */
    public static function calculate(int $totalDeclaredValue, int $totalNumberOfItems, ?array $shippingAddress = []): float
    {
        if (! array_key_exists('country_code', $shippingAddress)) {
            $shippingAddress['country_code'] = 'US';
        }

        if ($shippingAddress['country_code'] === 'US') {
            return NationalInsuredShippingFeeCalculator::calculate($totalDeclaredValue, $totalNumberOfItems);
        } else {
            return InternationalInsuredShippingFeeCalculator::calculate($totalNumberOfItems, $shippingAddress);
        }
    }

    protected static function calculateTotalDeclaredValue(Collection $orderItems): int
    {
        return $orderItems->sum('declared_value_total');
    }

    protected static function calculateTotalNumberOfItems(Collection $orderItems): int
    {
        return $orderItems->sum('quantity');
    }

    protected static function getShippingAddress(Order $order): array
    {
        $address = $order->shippingAddress->toArray();

        return array_merge($address, ['country_code' => Country::find($address['country_id'])->code]);
    }
}
