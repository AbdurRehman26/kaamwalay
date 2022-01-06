<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Wallet\WalletCreditGreaterThanOrderTotalException;
use App\Models\Order;

class WalletAmountGrandTotalValidator
{
    public static function validate(Order $order, float $amount)
    {
        if (
            $order->paymentMethod->isWallet() && $order->grand_total !== $amount
        ) {
            throw new WalletCreditGreaterThanOrderTotalException;
        }
    }
}
