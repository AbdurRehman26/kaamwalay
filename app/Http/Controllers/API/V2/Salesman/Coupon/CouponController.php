<?php

namespace App\Http\Controllers\API\V2\Salesman\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponHasInvalidMinThreshold;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Salesman\Coupon\CalculateCouponDiscountRequest;
use App\Http\Requests\API\V2\Salesman\Coupon\VerifyCouponRequest;
use App\Http\Resources\API\V2\Salesman\Coupon\VerifyCouponResource;
use App\Services\Admin\Coupon\CouponService;
use Exception;
use Illuminate\Http\JsonResponse;

class CouponController extends Controller
{
    public function __construct(private CouponService $couponService)
    {
    }

    public function verify(string $couponCode, VerifyCouponRequest $request): JsonResponse|VerifyCouponResource
    {
        $coupon = $this->couponService->returnCouponIfValid($couponCode, $request->only('couponables_id', 'items_count'));

        return new VerifyCouponResource($coupon);
    }

    /**
     * @throws Exception
     */
    public function calculateDiscount(CalculateCouponDiscountRequest $request): JsonResponse
    {
        try {
            $couponParams = [
                'couponables_id' => $request->payment_plan['id'],
                'items_count' => $request->input('items_count', 0),
            ];

            $coupon = $this->couponService->returnCouponIfValid($request->coupon['code'], $couponParams);

            $discountedAmount = $this->couponService->calculateDiscount(
                $coupon,
                $request->safe()->only('payment_plan', 'items')
            );
        } catch (Exception $e) {
            return match (true) {
                $e instanceof CouponHasInvalidMinThreshold => throw $e,
                default => new JsonResponse(
                    [
                        'error' => $e->getMessage(),
                    ],
                    $e->getCode()
                ),
            };
        }

        return response()->json(['data' =>
            [
                'discounted_amount' => $discountedAmount,
                'coupon' => new VerifyCouponResource($coupon),
            ],
        ]);
    }
}
