<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class WalletTransactionReason implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        return match ($value) {
            1 => 'order_payment',
            2 => 'refund',
            default => 'wallet_credit',
        };
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return match ($value) {
            'order_payment' => 1,
            'refund' => 2,
            default => 3,
        };
    }
}
