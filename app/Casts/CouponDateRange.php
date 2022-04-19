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
        return is_null($value) ? null : Carbon::parse($value);
    }

    /**
     * @inheritDoc
     */
    public function set($model, string $key, $value, array $attributes)
    {
        return match ($key) {
            'available_from' => Carbon::parse($value)->startOfDay()->toDateTimeString(),
            'available_till' => is_null($value) ? null : Carbon::parse($value)->endOfDay()->toDateTimeString(),
            default => null,
        };
    }
}
