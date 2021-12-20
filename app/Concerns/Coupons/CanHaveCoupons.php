<?php

namespace App\Concerns\Coupons;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait CanHaveCoupons
{
    public function coupons(): MorphMany
    {
        return $this->morphToMany(Coupon::class, 'couponables');
    }
}
