<?php

namespace App\Http\Controllers\API\V3\Admin\Cards;

use App\Http\Controllers\API\V2\Admin\Cards\CardCategoryController as CardsCardCategoryController;
use App\Http\Requests\API\V3\Admin\Card\StoreCardCategoryRequest;
use App\Http\Resources\API\V3\Admin\Card\CardCategoryResource;
use App\Services\Admin\Card\CardCategoryService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CardCategoryController extends CardsCardCategoryController
{
    public function __construct(protected CardCategoryService $cardCategoryService)
    {
    }

    public function store(StoreCardCategoryRequest $request): JsonResponse | CardCategoryResource {
        try {
            $series = $this->cardCategoryService->create($request->validated());
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new CardCategoryResource($series);
    }
}
