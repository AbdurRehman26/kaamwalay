<?php

namespace App\Http\Controllers\API\V1\Customer\Cards;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\Card\StoreCardProductRequest;
use App\Http\Resources\API\CardProduct\CardProductResource;
use App\Services\Card\CardProductService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CardProductController extends Controller
{
    public function __construct(protected CardProductService $cardProductService)
    {
    }

    public function store(StoreCardProductRequest $request): CardProductResource | JsonResponse
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
}
