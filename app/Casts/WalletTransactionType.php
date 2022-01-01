<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class WalletTransactionType implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        return match ($value) {
            1 => 'credit',
            default => 'debit',
        };
    }

    public function set($model, string $key, $value, array $attributes)
    {
        return match ($value) {
            'credit' => 1,
            default => 2,
        };
    }
}
