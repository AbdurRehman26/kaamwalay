<?php

namespace App\Services\Order\Validators;

use App\Exceptions\API\Customer\Wallet\AmountLessThanWalletAmountException;
use App\Models\Wallet;

class WalletCreditAppliedValidator
{
    public static function validate(array $data): void
    {
        if (!empty($data['payment_by_wallet'])) {
            throw_unless(
                Wallet::validateWalletAmount(
                    $data['payment_by_wallet']
                ),
                AmountLessThanWalletAmountException::class
            );
        }
    }
}
