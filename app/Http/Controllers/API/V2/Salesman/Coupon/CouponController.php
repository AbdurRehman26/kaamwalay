<?php

namespace App\Http\Controllers\API\V2\Salesman\Coupon;

use App\Exceptions\API\Salesman\Coupon\CouponableEntityDoesNotExistException;
use App\Exceptions\API\Salesman\Coupon\CouponCodeAlreadyExistsException;
use App\Exceptions\API\Salesman\Coupon\CouponHasInvalidMinThreshold;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Salesman\Coupon\CalculateCouponDiscountForOrderRequest;
use App\Http\Requests\API\V2\Salesman\Coupon\CalculateCouponDiscountRequest;
use App\Http\Requests\API\V2\Salesman\Coupon\StoreCouponRequest;
use App\Http\Requests\API\V2\Salesman\Coupon\VerifyCouponRequest;
use App\Http\Resources\API\V2\Salesman\Coupon\CouponCollection;
use App\Http\Resources\API\V2\Salesman\Coupon\CouponResource;
use App\Http\Resources\API\V2\Salesman\Coupon\VerifyCouponResource;
use App\Models\Coupon;
use App\Models\Order;
use App\Services\Salesman\Coupon\CouponService;
use Exception;
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
     * @throws CouponCodeAlreadyExistsException|CouponableEntityDoesNotExistException
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


    public function verify(string $couponCode, VerifyCouponRequest $request): JsonResponse|VerifyCouponResource
    {
        try {
            $coupon = $this->couponService->returnCouponIfValid($couponCode, $request->only('couponables_id', 'items_count'));

            return new VerifyCouponResource($coupon);
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
                'coupon' => new VerifyCouponResource($coupon),
            ],
        ]);
    }
}
