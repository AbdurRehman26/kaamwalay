<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Admin\Coupon\CouponResource;
use App\Models\Coupon;
use App\Services\Coupon\CouponService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CouponController extends Controller
{
    private CouponService $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    public function show($code): JsonResponse|CouponResource
    {
        try {

            $coupon = $this->couponService->checkIfCouponIsValid($code);

        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'error' => 'Coupon not found.',
                ],
                Response::HTTP_NOT_FOUND
            );
        }

        return new CouponResource($coupon);
    }
}
