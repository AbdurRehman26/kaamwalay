<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Coupon\CalculateCouponDiscountRequest;
use App\Http\Resources\API\Admin\Coupon\CouponResource;
use App\Services\Coupon\CouponService;
use App\Services\Order\CreateOrderService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CouponController extends Controller
{
    private CouponService $couponService;
    private CreateOrderService $createOrderService;

    public function __construct(CouponService $couponService, CreateOrderService $createOrderService)
    {
        $this->couponService = $couponService;
        $this->createOrderService = $createOrderService;
    }

    public function show(string $couponCode): JsonResponse|CouponResource
    {
        try {
            $coupon = $this->couponService->returnCouponIfValid($couponCode);
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

    public function calculateDiscount(CalculateCouponDiscountRequest $request)
    {
        $coupon = $this->couponService->returnCouponIfValid($request->coupon['code']);

        $discountedAmount = $this->couponService->calculateDiscount(
            $coupon,
            $this->createOrderService->createDraftOrder(
                $request->safe()->only('payment_plan', 'payment_method', 'shipping_method', 'items')
            )
        );

        try {
        } catch (\Exception $e) {
            return new JsonResponse(
                [
                    'error' => 'Coupon not found.',
                ],
                Response::HTTP_NOT_FOUND
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
