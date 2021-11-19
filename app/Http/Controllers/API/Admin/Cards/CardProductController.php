<?php

namespace App\Http\Controllers\API\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Card\StoreCardProductRequest;
use App\Http\Resources\API\CardProduct\CardProductResource;
use App\Services\Admin\Card\CardProductService;
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
            report($e);

            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new CardProductResource($card);
    }

    public function getOptionsValues()
    {
        return new JsonResponse($this->cardProductService->getOptionsValues());
    }
}
