<?php

namespace App\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CouponService
{
    public function getCoupons(): LengthAwarePaginator
    {
        return new \Illuminate\Pagination\LengthAwarePaginator([], 10, 1);
    }

}
