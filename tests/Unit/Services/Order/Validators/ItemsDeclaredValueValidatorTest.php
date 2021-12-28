<?php

use App\Exceptions\API\Customer\Order\ErrorInDeclaredValue;
use App\Exceptions\API\Customer\Order\ItemDeclaredValueLimitReached;
use App\Models\PaymentPlan;
use App\Services\Order\Validators\ItemsDeclaredValueValidator;

const MAX_PROTECTION_AMOUNT = 1000000;

beforeEach(function () {
    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => MAX_PROTECTION_AMOUNT]);
});

it('throws exception when order item total declared value is greater than schema limit', function () {
    ItemsDeclaredValueValidator::validate([
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'declared_value_per_unit' => 1000000,
                'quantity' => 100,
            ],
        ],
    ]);
})->throws(
    ItemDeclaredValueLimitReached::class,
    'Total declared value of any card must not be greater than $99999999.99. Please go back and update.'
);

it('throws exception when order item declared value is greater than payment plan max protection amount', function () {
    ItemsDeclaredValueValidator::validate([
        'payment_plan' => [
            'id' => $this->paymentPlan->id,
        ],
        'items' => [
            [
                'declared_value_per_unit' => MAX_PROTECTION_AMOUNT + 1,
                'quantity' => 1,
            ],
        ],
    ]);
})->throws(
    ErrorInDeclaredValue::class,
    'Declared value of any card must not be greater than service level maximum protection. Please go back and update.'
);
