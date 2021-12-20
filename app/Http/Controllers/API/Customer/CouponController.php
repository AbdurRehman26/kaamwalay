<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Coupon\ShowCouponRequest;
use App\Models\Coupon;
use App\Services\Coupon\CouponService;

class CouponController extends Controller
{
    private CouponService $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    public function show(ShowCouponRequest $request, Coupon $coupon)
    {

        $this->couponService->checkCouponIsValid($coupon);
        dd($coupon);

        return false;
    }
}
