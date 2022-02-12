<?php

namespace App\Concerns\Coupons;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait CanHaveCoupons
{
    /**
     * @return MorphToMany <Coupon>
     */
    public function coupons(): MorphToMany
    {
        return $this->morphToMany(Coupon::class, 'couponables');
    }
}
