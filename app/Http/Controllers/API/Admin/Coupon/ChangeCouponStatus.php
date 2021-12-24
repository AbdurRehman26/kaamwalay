<?php

namespace App\Http\Controllers\API\Admin\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Coupon\ChangeCouponStatusRequest;
use App\Http\Resources\API\Admin\Coupon\CouponResource;
use App\Models\Coupon;
use App\Services\Admin\Coupon\CouponService;

class ChangeCouponStatus extends Controller
{
    public function __invoke(
        Coupon $coupon,
        ChangeCouponStatusRequest $request,
        CouponService $couponService
    ): CouponResource {
        $coupon = $couponService->changeStatus($coupon, $request->input('status'));

        return new CouponResource($coupon);
    }
}
