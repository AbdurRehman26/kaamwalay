<?php

namespace App\Casts;

use App\Models\WalletTransaction;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class WalletTransactionReason implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        return match ($value) {
            1 => WalletTransaction::REASON_ORDER_PAYMENT,
            2 => WalletTransaction::REASON_REFUND,
            3 => WalletTransaction::REASON_WALLET_CREDIT,
            default => 'wallet_payment',
        };
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return match ($value) {
            WalletTransaction::REASON_ORDER_PAYMENT => 1,
            WalletTransaction::REASON_REFUND => 2,
            WalletTransaction::REASON_WALLET_CREDIT => 3,
            default => 4,
        };
    }
}
