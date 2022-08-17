<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\API\V1\Admin\Cards\CardProductController as V1CardProductController;
use App\Http\Requests\API\V2\Admin\Card\UpdateCardProductRequest;
use App\Http\Resources\API\V2\CardProduct\CardProductCollection;
use App\Http\Resources\API\V2\CardProduct\CardProductResource;
use App\Models\CardProduct;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CardProductController extends V1CardProductController
{
    public function index(): CardProductCollection
    {
        $cards = $this->cardProductService->getCards();

        return new CardProductCollection($cards);
    }

    public function show(CardProduct $cardProduct): CardProductResource
    {
        return new CardProductResource($cardProduct);
    }

    public function update(UpdateCardProductRequest $request, CardProduct $cardProduct): CardProductResource
    {
        $cardProduct = $this->cardProductService->updateCard($cardProduct, $request->validated());

        return new CardProductResource($cardProduct);
    }

    public function destroy(CardProduct $cardProduct): JsonResponse
    {
        $cardProduct->deleteOrFail();

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
