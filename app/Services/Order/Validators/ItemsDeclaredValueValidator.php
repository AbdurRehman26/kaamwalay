<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Order\ErrorInDeclaredValue;
use App\Exceptions\API\Customer\Order\ItemDeclaredValueLimitReached;
use App\Models\PaymentPlan;

class ItemsDeclaredValueValidator
{
    public const MAX_DECLARED_VALUE_PER_DB_SCHEMA = 99999999.99;

    public static function validate(array $data)
    {
        $paymentPlanMaxProtectionAmount = PaymentPlan::find($data['payment_plan']['id'])->max_protection_amount;

        foreach ($data['items'] as $item) {
            if ($item['declared_value_per_unit'] > $paymentPlanMaxProtectionAmount) {
                throw new ErrorInDeclaredValue;
            }

            if (($item['declared_value_per_unit'] * $item['quantity']) > self::MAX_DECLARED_VALUE_PER_DB_SCHEMA) {
                throw new ItemDeclaredValueLimitReached;
            }
        }
    }
}
