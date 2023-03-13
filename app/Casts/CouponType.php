<?php

namespace App\Casts;

use App\Models\Coupon;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

class CouponType implements CastsAttributes
{
    /**
     * @inheritDoc
     */
    public function get(Model $model, string $key, mixed $value, array $attributes)
    {
        return array_search($value, Coupon::COUPON_TYPE_MAPPING);
    }

    /**
     * @inheritDoc
     */
    public function set(Model $model, string $key, mixed $value, array $attributes)
    {
        return Coupon::COUPON_TYPE_MAPPING[$value];
    }
}
