<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class CouponType implements CastsAttributes
{

    /**
     * @inheritDoc
     */
    public function get($model, string $key, $value, array $attributes)
    {
        return array_search($value, $this->values());
    }

    /**
     * @inheritDoc
     */
    public function set($model, string $key, $value, array $attributes)
    {
        return $this->values()[$value];
    }

    protected function values()
    {
        return [
            'fixed' => 1,
            'percentage' => 2,
        ];
    }
}
