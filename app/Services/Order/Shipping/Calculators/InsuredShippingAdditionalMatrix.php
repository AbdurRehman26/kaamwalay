<?php

namespace App\Services\Order\Shipping\Calculators;

abstract class InsuredShippingAdditionalMatrix
{
    public const MAX_DECLARED_VALUE_FOR_NO_ADDITIONAL_FEE = 200000;
    public const EACH_OVER_DECLARED_VALUE_FOR_ADDITIONAL_FEE = 50000;
    public const FEE_PER_ADDITIONAL_DECLARED_VALUE = 20;
    public const MAX_NUMBER_OF_CARDS_FOR_NO_ADDITIONAL_FEE = 25;
    public const FEE_PER_ADDITIONAL_CARD_MATRIX = [
        '1-1000' => 0.25,
        '1001-5000' => 0.25,
        '5001-15000' => 0.25,
        '15001-25000' => 0.25,
        '25000-50000' => 0.50,
        '50001-75000' => 0.50,
        '75001-100000' => 0.50,
        '100001-150000' => 0.50,
        '150001-200000' => 0.50,
    ];
}
