<?php

namespace App\Http\Controllers\API\V1\Admin\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Admin\Coupon\CouponApplicableCollection;
use App\Models\CouponApplicable;

class CouponApplicableController extends Controller
{
    public function __invoke(): CouponApplicableCollection
    {
        $couponApplicables = CouponApplicable::onlyActive()->get();

        return new CouponApplicableCollection($couponApplicables);
    }
}
