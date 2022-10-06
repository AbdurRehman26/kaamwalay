<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Card\StoreCardRarityRequest;
use App\Http\Requests\API\V2\Admin\Card\UpdateCardRarityRequest;
use App\Http\Resources\API\V2\Admin\CardRarity\CardRarityCollection;
use App\Http\Resources\API\V2\Admin\CardRarity\CardRarityResource;
use App\Models\CardRarity;
use App\Services\Admin\Card\CardRarityService;

class CardRarityController extends Controller
{
    public function __construct(private CardRarityService $cardRarityService)
    {
    }

    public function index(): CardRarityCollection
    {
        dd(1);
        return new CardRarityCollection($this->cardRarityService->getCardRarities());
    }

    public function store(StoreCardRarityRequest $request): CardRarityResource
    {
        return new CardRarityResource(CardRarity::create($request->validated()));
    }

    public function update(UpdateCardRarityRequest $request, CardRarity $cardRarity): CardRarityResource
    {
        return new CardRarityResource($cardRarity->update([
            'name' => $request->name
        ]));
    }
}
