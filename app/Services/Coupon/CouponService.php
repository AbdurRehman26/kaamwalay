<?php

namespace App\Services\Coupon;

use App\Models\Coupon;

class CouponService
{
    public function checkIfCouponIsValid($code): Coupon
    {
        Coupon::where('code', $code)->
        return true;
    }
}
