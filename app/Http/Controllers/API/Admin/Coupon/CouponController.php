<?php

namespace App\Http\Controllers\API\Admin\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Coupon\StoreCouponRequest;
use App\Http\Resources\API\Admin\Coupon\CouponCollection;
use App\Http\Resources\API\Admin\Coupon\CouponResource;
use App\Services\Admin\Coupon\CouponService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

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
        $coupon = $this->couponService->storeCoupon($request->validated(), $request->user());

        return new CouponResource($coupon);
    }

    public function show(int $coupon): CouponResource
    {
        $coupon = $this->couponService->getCoupon($coupon);

        return new CouponResource($coupon);
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
