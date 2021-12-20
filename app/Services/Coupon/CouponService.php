<?php

namespace App\Services\Coupon;

use App\Models\Coupon;

class CouponService
{
    public function returnCouponIfValid(string $couponCode): Coupon
    {
        $coupon = Coupon::whereCode($couponCode)->ValidOnCurrentDate()->first();

        throw_if(! $coupon);

        return $coupon;
    }
}
