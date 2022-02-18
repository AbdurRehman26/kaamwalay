<?php

namespace App\Http\Controllers\API\V1\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\Card\StoreCardSetRequest;
use App\Http\Resources\API\V1\CardSet\CardSetCollection;
use App\Http\Resources\API\V1\CardSet\CardSetResource;
use App\Services\Admin\Card\CardSetService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Exception;

class CardSetController extends Controller
{
    public function __construct(protected CardSetService $cardSetService)
    {
    }

    public function index(): CardSetCollection
    {
        return new CardSetCollection(
            $this->cardSetService->search()
        );
    }

    public function store(StoreCardSetRequest $request): CardSetResource | JsonResponse
    {
        try {
            $set = $this->cardSetService->create($request->validated());
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new CardSetResource($set);
    }
}
