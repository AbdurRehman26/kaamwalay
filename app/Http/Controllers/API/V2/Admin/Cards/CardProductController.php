<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Exceptions\API\Admin\CardProductCanNotBeDeleted;
use App\Exceptions\API\Admin\CardProductCanNotBeUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\Card\StoreCardProductRequest;
use App\Http\Requests\API\V2\Admin\Card\UpdateCardProductRequest;
use App\Http\Resources\API\V2\CardProduct\CardProductCollection;
use App\Http\Resources\API\V2\CardProduct\CardProductResource;
use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Services\Admin\Card\CardProductService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CardProductController extends Controller
{
    public function __construct(protected CardProductService $cardProductService)
    {
    }

    public function index(): CardProductCollection
    {
        $cards = $this->cardProductService->getCards();

        return new CardProductCollection($cards);
    }

    public function store(StoreCardProductRequest $request): CardProductResource|JsonResponse
    {
        try {
            $card = $this->cardProductService->create($request->validated());
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new CardProductResource($card);
    }

    public function getOptionsValues(CardCategory $cardCategory): JsonResponse
    {
        return new JsonResponse($this->cardProductService->getOptionsValues($cardCategory));
    }

    public function show(CardProduct $cardProduct): CardProductResource
    {
        return new CardProductResource($cardProduct);
    }

    /**
     * @throws CardProductCanNotBeUpdated
     */
    public function update(UpdateCardProductRequest $request, CardProduct $cardProduct): CardProductResource
    {
        $cardProduct = $this->cardProductService->updateCard($cardProduct, $request->validated());

        return new CardProductResource($cardProduct);
    }

    /**
     * @throws CardProductCanNotBeDeleted
     */
    public function destroy(CardProduct $cardProduct): JsonResponse
    {
        $this->cardProductService->deleteCard($cardProduct);

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
