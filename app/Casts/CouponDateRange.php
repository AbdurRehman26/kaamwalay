<?php

namespace App\Casts;

use Carbon\Carbon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class CouponDateRange implements CastsAttributes
{

    /**
     * @inheritDoc
     * @retrun Carbon
     */
    public function get($model, string $key, $value, array $attributes)
    {
        return Carbon::parse($value);
    }

    /**
     * @inheritDoc
     */
    public function set($model, string $key, $value, array $attributes)
    {
        return match ($key) {
            'available_from' => Carbon::parse($value)->startOfDay()->toDateTimeString(),
            'available_till' => Carbon::parse($value)->endOfDay()->toDateTimeString(),
            default => null,
        };
    }
}
