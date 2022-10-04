<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Admin\CardRarity\CardRarityCollection;
use App\Services\Admin\Card\CardRarityService;

class CardRarityController extends Controller
{
    public function __construct(private CardRarityService $cardRarityService)
    {
    }

        public function index(): CardRarityCollection
    {
        $coupons = $this->cardRarityService->getCardRarities();

        return new CouponCollection($coupons);
    }

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
