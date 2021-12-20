<?php

namespace App\Services\Coupon;

use App\Models\Coupon;
use App\Services\Coupon\Couponables\CouponAbleInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CouponService
{
    public function getCoupons(): LengthAwarePaginator
    {
        return new \Illuminate\Pagination\LengthAwarePaginator([], 10, 1);
    }

    public function checkCouponIsValid(Coupon $coupon, CouponAbleInterface $couponAble): bool
    {
        return true;
    }
}
