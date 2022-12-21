<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Exceptions\API\Customer\Coupon\CouponHasInvalidMinThreshold;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Customer\Coupon\CalculateCouponDiscountForOrderRequest;
use App\Http\Requests\API\V2\Customer\Coupon\CalculateCouponDiscountRequest;
use App\Http\Requests\API\V2\Customer\Coupon\ShowCouponRequest;
use App\Http\Resources\API\V2\Customer\Coupon\CouponResource;
use App\Models\Order;
use App\Services\Coupon\V2\CouponService;
use App\Services\Order\V2\OrderService;
use Exception;
use Illuminate\Http\JsonResponse;

class CouponController extends Controller
{
    public function __construct(private CouponService $couponService)
    {
    }

    public function show(string $couponCode, ShowCouponRequest $request): JsonResponse|CouponResource
    {
        try {
            $coupon = $this->couponService->returnCouponIfValid($couponCode, $request->only('couponables_id', 'items_count'));
            return new CouponResource($coupon);
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' =>  $e->getMessage(),
                ],
                $e->getCode()
            );
        }
    }

    public function calculateDiscountForOrder(CalculateCouponDiscountForOrderRequest $request, Order $order): JsonResponse
    {
        try {
            $couponParams = [
                'couponables_id' => $order->payment_plan_id,
                'items_count' => $order->orderItems()->sum('quantity'),
            ];

            $coupon = $this->couponService->returnCouponIfValid($request->coupon['code'], $couponParams);

            $discountedAmount = $this->couponService->calculateDiscount(
                $coupon,
                $order
            );

            /** @var OrderService $orderService */
            $orderService = resolve(OrderService::class);

            $orderService->attachCouponToOrder($order, $coupon, $discountedAmount);
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
                'coupon' => new CouponResource($coupon),
            ],
        ]);
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
                'coupon' => new CouponResource($coupon),
            ],
        ]);
    }
}
