<?php

namespace App\Services\Order\Validators\V2;

use App\Exceptions\API\Customer\Wallet\InvalidCreditAppliedAmountException;
use App\Models\Order;

use function throw_if;

class WalletAmountGrandTotalValidator
{
    public static function validate(Order $order, float $amount): void
    {
        throw_if(
            $amount > $order->grand_total,
            new InvalidCreditAppliedAmountException()
        );
    }
}
