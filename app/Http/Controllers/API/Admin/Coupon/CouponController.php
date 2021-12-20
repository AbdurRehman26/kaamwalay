<?php

namespace App\Http\Controllers\API\Admin\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Coupon\ChangeCouponStatusRequest;
use App\Http\Requests\API\Admin\Coupon\StoreCouponRequest;
use App\Http\Resources\API\Admin\Coupon\CouponCollection;
use App\Http\Resources\API\Admin\Coupon\CouponResource;
use App\Models\Coupon;
use App\Services\Admin\Coupon\CouponService;

class CouponController extends Controller
{
    public function __construct(private CouponService $couponService)
    {
    }

    public function index(): CouponCollection
    {
        $coupons = $this->couponService->getCoupons();

        return new CouponCollection($coupons);
    }

    /**
     * @throws CouponCodeAlreadyExistsException
     */
    public function store(StoreCouponRequest $request): CouponResource
    {
        $coupon = $this->couponService->storeCoupon($request->validated());

        return new CouponResource($coupon);
    }

    public function show(int $coupon): CouponResource
    {
        $coupon = $this->couponService->getCoupon($coupon);

        return new CouponResource($coupon);
    }

    public function changeStatus(Coupon $coupon, ChangeCouponStatusRequest $request)
    {
        $coupon = $this->couponService->changeStatus($coupon, $request->get('status'));

        return new CouponResource($coupon);
    }
}
