<?php

namespace App\Casts;

use App\Models\Coupon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class CouponType implements CastsAttributes
{
    /**
     * @inheritDoc
     */
    public function get($model, string $key, $value, array $attributes)
    {
        return array_search($value, Coupon::COUPON_TYPE_MAPPING);
    }

    /**
     * @inheritDoc
     */
    public function set($model, string $key, $value, array $attributes)
    {
        return Coupon::COUPON_TYPE_MAPPING[$value];
    }
}
