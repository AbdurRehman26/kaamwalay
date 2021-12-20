<?php

namespace App\Services\Coupon\Couponables;

interface CouponAbleInterface
{
    public function isCouponValid(string $couponCode);
}
