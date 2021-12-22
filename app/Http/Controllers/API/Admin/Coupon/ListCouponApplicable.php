<?php

namespace App\Http\Controllers\API\Admin\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Admin\Coupon\CouponApplicableCollection;
use App\Models\CouponApplicable;

class ListCouponApplicable extends Controller
{
    public function __invoke(): CouponApplicableCollection
    {
        $couponApplicables = CouponApplicable::onlyActive()->get();

        return new CouponApplicableCollection($couponApplicables);
    }
}
