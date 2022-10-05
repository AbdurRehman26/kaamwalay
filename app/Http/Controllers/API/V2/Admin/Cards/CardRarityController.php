<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Admin\CardRarity\CardRarityCollection;
use App\Http\Resources\API\V2\Admin\CardRarity\CardRarityResource;
use App\Services\Admin\Card\CardRarityService;

class CardRarityController extends Controller
{
    public function __construct(private CardRarityService $cardRarityService)
    {
    }

    public function index(): CardRarityCollection
    {
        return new CardRarityCollection($this->cardRarityService->getCardRarities());
    }

    public function store(StoreCardRarityRequest $request): CardRarityResource
    {
        $coupon = $this->couponService->storeCoupon($request->validated(), $request->user());

        return new CouponResource($coupon);
    }

    public function update(AddExtraCardRequest $request, Order $order): CardRarityResource
    {
        $this->authorize('review', $order);

        try {
            $result = $orderService->editCard($order, $orderItem, $request->card_id, $request->value);

            return new OrderItemResource($result);
        } catch (OrderItemDoesNotBelongToOrder $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
