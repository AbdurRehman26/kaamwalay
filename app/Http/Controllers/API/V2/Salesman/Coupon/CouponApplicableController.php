<?php

namespace App\Http\Controllers\API\V2\Salesman\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Salesman\Coupon\CouponApplicableCollection;
use App\Models\CouponApplicable;

class CouponApplicableController extends Controller
{
    public function __invoke(): CouponApplicableCollection
    {
        $couponApplicables = CouponApplicable::onlyActive()->get();

        return new CouponApplicableCollection($couponApplicables);
    }
}
