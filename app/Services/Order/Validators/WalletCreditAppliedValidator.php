<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Wallet\WalletAmountLessThanEnteredAmount;
use App\Services\Wallet\WalletService;

class WalletCreditAppliedValidator
{
    public static function validate(array $data): void
    {
        if (!empty($data['payment_by_wallet'])) {
            throw_unless(
                WalletService::validateWalletAmount(
                    $data['payment_by_wallet']
                ),
                EnteredAmountIsLessThanWalletAmount::class
            );
        }
    }
}
