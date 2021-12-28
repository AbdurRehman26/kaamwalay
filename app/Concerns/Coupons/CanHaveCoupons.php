<?php

namespace App\Concerns\Coupons;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait CanHaveCoupons
{
    public function coupons(): MorphToMany
    {
        return $this->morphToMany(Coupon::class, 'couponables');
    }
}
