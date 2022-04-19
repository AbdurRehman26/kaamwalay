<?php

namespace App\Http\Controllers\API\V2\Admin\Coupon;

use App\Http\Controllers\API\V1\Admin\Coupon\CouponController as V1CouponController;
use App\Http\Resources\API\V2\Admin\Coupon\CouponCollection;
use App\Services\Admin\Coupon\CouponService;

class CouponController extends V1CouponController
{
    public function __construct(private CouponService $couponService)
    {
        parent::__construct($this->couponService);
    }

    public function index(): CouponCollection
    {
        $coupons = $this->couponService->getCoupons();

        return new CouponCollection($coupons);
    }
}
