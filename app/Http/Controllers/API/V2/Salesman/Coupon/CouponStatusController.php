<?php

namespace App\Http\Controllers\API\V2\Salesman\Coupon;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Salesman\Coupon\ChangeCouponStatusRequest;
use App\Http\Resources\API\V2\Salesman\Coupon\CouponResource;
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
