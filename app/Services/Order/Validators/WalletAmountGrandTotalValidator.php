<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Wallet\WalletBalanceGreaterThanOrderTotalException;
use App\Models\Order;

class WalletAmountGrandTotalValidator
{
    public static function validate(Order $order, float $amount): void
    {
        if (
            ($order->paymentMethod->isWallet() && $order->grand_total !== $amount) ||
            (!$order->paymentMethod->isWallet() && $amount >= $order->grand_total)
        ) {
            throw new WalletBalanceGreaterThanOrderTotalException;
        }
    }
}
