<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Coupon\CalculateCouponDiscountRequest;
use App\Http\Requests\API\Customer\Coupon\ShowCouponRequest;
use App\Http\Resources\API\Customer\Coupon\CouponResource;
use App\Services\Coupon\CouponService;
use App\Services\Order\CreateOrderService;
use Illuminate\Http\JsonResponse;

class CouponController extends Controller
{
    private CouponService $couponService;
    private CreateOrderService $createOrderService;

    public function __construct(CouponService $couponService, CreateOrderService $createOrderService)
    {
        $this->couponService = $couponService;
        $this->createOrderService = $createOrderService;
    }

    public function show(string $couponCode, ShowCouponRequest $request): JsonResponse|CouponResource
    {
        try {
            $coupon = $this->couponService->returnCouponIfValid($couponCode, $request->only('couponable_type', 'couponable_id'));
        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                $e->getCode()
            );
        }

        return new CouponResource($coupon);
    }

    public function calculateDiscount(CalculateCouponDiscountRequest $request)
    {
        $couponParams = [
            'couponable_type' => 'service_level',
            'couponable_id' => $request->payment_plan['id'],
        ];

        $coupon = $this->couponService->returnCouponIfValid($request->coupon['code'], $couponParams);

        $discountedAmount = $this->couponService->calculateDiscount(
            $coupon,
            $request->safe()->only('payment_plan', 'items')
        );

        try {
        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                $e->getCode()
            );
        }

        return response()->json(['data' =>
                [
                    'discounted_amount' => $discountedAmount,
                    'coupon' => new CouponResource($coupon),
                ],
        ]);
    }
}
