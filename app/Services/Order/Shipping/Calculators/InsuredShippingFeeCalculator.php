<?php

namespace App\Services\Order\Shipping\Calculators;

use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;

class InsuredShippingFeeCalculator
{
    public static float $shippingFee;

    public static function calculateForOrder(Order $order): float
    {
        return self::calculate(
            self::calculateTotalDeclaredValue($order->orderItems),
            self::calculateTotalNumberOfItems($order->orderItems)
        );
    }

    public static function calculate(int $totalDeclaredValue, int $totalNumberOfItems): float
    {
        self::$shippingFee = self::calculateBasicShippingFee($totalDeclaredValue, $totalNumberOfItems);

        if (self::additionalShippingFeeIsApplicable($totalDeclaredValue, $totalNumberOfItems)) {
            self::$shippingFee += self::calculateAdditionalShippingFee($totalDeclaredValue, $totalNumberOfItems);
        }

        return self::$shippingFee;
    }

    protected static function calculateTotalDeclaredValue(Collection $orderItems): int
    {
        return $orderItems->sum('declared_value_total');
    }

    protected static function calculateTotalNumberOfItems(Collection $orderItems): int
    {
        return $orderItems->sum('quantity');
    }

    protected static function calculateBasicShippingFee(int $declaredValue, int $numberOfItems): float
    {
        return InsuredShippingBasicMatrix::BASIC_FEE_MATRIX[self::getDeclaredValueRangeKey($declaredValue)][self::getNumberOfItemsRangeKey($numberOfItems)];
    }

    protected static function getDeclaredValueRangeKey(int $declaredValue): string
    {
        if ($declaredValue <= InsuredShippingAdditionalMatrix::MAX_DECLARED_VALUE_FOR_NO_ADDITIONAL_FEE) {
            foreach (InsuredShippingBasicMatrix::DECLARED_VALUE_RANGE as $key => $declaredValueRange) {
                if ($declaredValue >= $declaredValueRange[0] && $declaredValue <= $declaredValueRange[1]) {
                    return $key;
                }
            }
        } else {
            return array_key_last(InsuredShippingBasicMatrix::DECLARED_VALUE_RANGE);
        }

        throw new \Exception();
    }

    protected static function getNumberOfItemsRangeKey(int $numberOfItems): string
    {
        if ($numberOfItems <= InsuredShippingAdditionalMatrix::MAX_NUMBER_OF_CARDS_FOR_NO_ADDITIONAL_FEE) {
            foreach (InsuredShippingBasicMatrix::NUMBER_OF_ITEM_RANGE as $key => $numberOfItemsRange) {
                if ($numberOfItems >= $numberOfItemsRange[0] && $numberOfItems <= $numberOfItemsRange[1]) {
                    return $key;
                }
            }
        } else {
            return array_key_last(InsuredShippingBasicMatrix::NUMBER_OF_ITEM_RANGE);
        }

        throw new \Exception();
    }

    protected static function additionalShippingFeeIsApplicable(int $declaredValue, int $numberOfItems): bool
    {
        if (
            $declaredValue > InsuredShippingAdditionalMatrix::MAX_DECLARED_VALUE_FOR_NO_ADDITIONAL_FEE ||
            $numberOfItems > InsuredShippingAdditionalMatrix::MAX_NUMBER_OF_CARDS_FOR_NO_ADDITIONAL_FEE
        ) {
            return true;
        }

        return false;
    }

    protected static function calculateAdditionalShippingFee(int $declaredValue, int $numberOfItems): float
    {
        $additionalShippingFee = 0;

        if ($declaredValue > InsuredShippingAdditionalMatrix::MAX_DECLARED_VALUE_FOR_NO_ADDITIONAL_FEE) {
            $additionalShippingFee += (
                floor(($declaredValue - InsuredShippingAdditionalMatrix::MAX_DECLARED_VALUE_FOR_NO_ADDITIONAL_FEE) /
                InsuredShippingAdditionalMatrix::EACH_OVER_DECLARED_VALUE_FOR_ADDITIONAL_FEE)
            ) * InsuredShippingAdditionalMatrix::FEE_PER_ADDITIONAL_DECLARED_VALUE;
        }

        if ($numberOfItems > InsuredShippingAdditionalMatrix::MAX_NUMBER_OF_CARDS_FOR_NO_ADDITIONAL_FEE) {
            $declaredValueRangeKey = self::getDeclaredValueRangeKey($declaredValue);

            $additionalShippingFee += (
                $numberOfItems - InsuredShippingAdditionalMatrix::MAX_NUMBER_OF_CARDS_FOR_NO_ADDITIONAL_FEE
            ) * InsuredShippingAdditionalMatrix::FEE_PER_ADDITIONAL_CARD_MATRIX[$declaredValueRangeKey];
        }

        return $additionalShippingFee;
    }
}
