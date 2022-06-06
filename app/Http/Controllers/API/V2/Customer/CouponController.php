<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Http\Controllers\API\V1\Customer\CouponController as V1CouponController;
use App\Http\Requests\API\V2\Customer\Coupon\CalculateCouponDiscountForOrderRequest;
use App\Http\Resources\API\V1\Customer\Coupon\CouponResource;
use App\Models\Order;
use App\Services\Coupon\CouponService;
use Illuminate\Http\JsonResponse;

class CouponController extends V1CouponController
{
    private CouponService $couponService;

    public function __construct(CouponService $couponService)
    {
        parent::__construct($couponService);

        $this->couponService = $couponService;
    }

    public function calculateDiscountForOrder(CalculateCouponDiscountForOrderRequest $request, Order $order): JsonResponse
    {
        try {
            $couponParams = [
                'couponables_id' => $order->payment_plan_id,
            ];

            $coupon = $this->couponService->returnCouponIfValid($request->coupon['code'], $couponParams);

            $discountedAmount = $this->couponService->calculateDiscount(
                $coupon,
                $order
            );
        } catch (Exception $e) {
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
