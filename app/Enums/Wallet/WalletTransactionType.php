<?php

namespace App\Enums\Wallet;

enum WalletTransactionType: int
{
    case CREDIT = 1;
    case DEBIT = 2;

    public function toString(): string
    {
        return match($this) {
            self::DEBIT => 'debit',
            default => 'credit',
        };
    }

    public function fromString(): string
    {
        return match($this) {
            self::DEBIT => 'debit',
            default => 'credit',
        };
    }
}
