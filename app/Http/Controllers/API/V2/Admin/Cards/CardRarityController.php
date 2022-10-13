<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Card\StoreCardRarityRequest;
use App\Http\Requests\API\V2\Admin\Card\UpdateCardRarityRequest;
use App\Http\Resources\API\V2\Admin\CardRarity\CardRarityCollection;
use App\Http\Resources\API\V2\Admin\CardRarity\CardRarityResource;
use App\Models\CardRarity;
use App\Services\Admin\Card\CardRarityService;
use Illuminate\Http\JsonResponse;

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
        return new CardRarityResource(CardRarity::create($request->validated()));
    }

    public function show(CardRarity $cardRarity): CardRarityResource
    {
        return new CardRarityResource($cardRarity);
    }

    public function update(int $cardRarityId, UpdateCardRarityRequest $request): JsonResponse
    {
        CardRarity::where('id', $cardRarityId)->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Card Rarity Updated successfully.',
        ]);
    }
}
