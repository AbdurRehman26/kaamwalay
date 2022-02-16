<?php

use App\Exceptions\API\Customer\Order\GrandTotalValueLimitReached;
use App\Models\Order;
use App\Services\Order\Validators\GrandTotalValidator;

const MAX_VALUE = 99999999.99;

it('throws exception when order grand total is greater than schema limit', function () {
    $order = Order::factory()->make([
        'grand_total' => MAX_VALUE + 1,
    ]);

    GrandTotalValidator::validate($order);
})->throws(
    GrandTotalValueLimitReached::class,
    'Order grand total must not be greater than $' . MAX_VALUE . '. Please go back and update cards.'
);
