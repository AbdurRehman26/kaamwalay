<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Order\GrandTotalValueLimitReached;
use App\Models\Order;

class GrandTotalValidator
{
    public const MAX_GRAND_TOTAL_VALUE_PER_DB_SCHEMA = 99999999.99;

    public static function validate(Order $order)
    {
        if ($order->grand_total > self::MAX_GRAND_TOTAL_VALUE_PER_DB_SCHEMA) {
            throw new GrandTotalValueLimitReached;
        }
    }
}
