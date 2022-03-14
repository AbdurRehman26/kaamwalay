<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Wallet\InvalidCreditAppliedAmountException;
use App\Models\Order;

class WalletAmountGrandTotalValidator
{
    public static function validate(Order $order, float $amount): void
    {
        throw_if(
            $order->paymentMethod?->isWallet() && $order->grand_total !== $amount,
            new InvalidCreditAppliedAmountException('Credit applied is not equal to grand total.')
        );

        throw_if(
            ! $order->paymentMethod?->isWallet() && $amount > $order->grand_total,
            new InvalidCreditAppliedAmountException()
        );
    }
}
