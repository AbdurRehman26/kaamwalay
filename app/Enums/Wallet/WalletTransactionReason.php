<?php

namespace App\Enums\Wallet;

enum WalletTransactionReason: int
{
    case REFUND = 1;
    case ORDER_PAYMENT = 2;
    case WALLET_CREDIT = 3;
    case WALLET_PAYMENT = 4;

    public function toString(): string
    {
        return match ($this) {
            self::REFUND => 'refund',
            self::ORDER_PAYMENT => 'order_payment',
            self::WALLET_CREDIT => 'wallet_credit_by_admin',
            default => 'wallet_credit_by_user',
        };
    }
}
