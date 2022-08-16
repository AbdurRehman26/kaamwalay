<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\API\V1\Admin\Cards\CardProductController as V1CardProductController;
use App\Http\Requests\API\V2\Admin\Card\UpdateCardProductRequest;
use App\Http\Resources\API\V2\CardProduct\CardProductCollection;
use App\Http\Resources\API\V2\CardProduct\CardProductResource;
use App\Models\CardProduct;

class CardProductController extends V1CardProductController
{
    public function index(): CardProductCollection
    {
        $cards = $this->cardProductService->getCards();

        return new CardProductCollection($cards);
    }

    public function update(UpdateCardProductRequest $request, CardProduct $cardProduct): CardProductResource
    {
        $cardProduct->update($request->validated());

        return new CardProductResource($cardProduct);
    }
}
