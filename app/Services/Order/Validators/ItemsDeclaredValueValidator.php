<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Order\ErrorInDeclaredValue;
use App\Models\PaymentPlan;

class ItemsDeclaredValueValidator
{
    public static function validate(array $data)
    {
        $paymentPlanMaxProtectionAmount = PaymentPlan::find($data['payment_plan']['id'])->max_protection_amount;

        foreach ($data['items'] as $item) {
            if ($item['declared_value_per_unit'] > $paymentPlanMaxProtectionAmount) {
                throw new ErrorInDeclaredValue;
            }
        }
    }
}
