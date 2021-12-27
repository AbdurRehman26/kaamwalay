<?php

namespace App\Http\Controllers\API\V1\Admin\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\Coupon\ChangeCouponStatusRequest;
use App\Http\Resources\API\V1\Admin\Coupon\CouponResource;
use App\Models\Coupon;
use App\Services\Admin\Coupon\CouponService;

class CouponStatusController extends Controller
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
