<?php

namespace App\Http\Controllers\API\V2\Admin\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponableEntityDoesNotExistException;
use App\Exceptions\API\Admin\Coupon\CouponCodeAlreadyExistsException;
use App\Exceptions\API\Admin\Coupon\CouponHasInvalidMinThreshold;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Coupon\CalculateCouponDiscountForOrderRequest;
use App\Http\Requests\API\V2\Admin\Coupon\StoreCouponRequest;
use App\Http\Resources\API\V1\Admin\Coupon\CouponResource;
use App\Http\Resources\API\V2\Admin\Coupon\CouponCollection;
use App\Models\Coupon;
use App\Models\Order;
use App\Services\Admin\Coupon\CouponService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Exception;

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

    public function calculateDiscountForOrder(CalculateCouponDiscountForOrderRequest $request, Order $order): JsonResponse
    {
        try {
            $couponParams = [
                'couponables_id' => $order->payment_plan_id,
                'items_count' => $request->input('items_count', 0),
            ];

            $coupon = $this->couponService->returnCouponIfValid($request->coupon['code'], $couponParams);

            $discountedAmount = $this->couponService->calculateDiscount(
                $coupon,
                $order
            );
        } catch (Exception $e) {
            return match (true) {
                $e instanceof CouponHasInvalidMinThreshold => new $e,
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
