<?php

namespace App\Http\Controllers\API\V1\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V1\Admin\Card\StoreCardSeriesRequest;
use App\Http\Resources\API\V1\CardSeries\CardSeriesCollection;
use App\Http\Resources\API\V1\CardSeries\CardSeriesResource;
use App\Services\Admin\Card\CardSeriesService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CardSeriesController extends Controller
{
    public function __construct(protected CardSeriesService $cardSeriesService)
    {
    }

    public function index(): CardSeriesCollection
    {
        return new CardSeriesCollection(
            $this->cardSeriesService->search()
        );
    }

    public function store(StoreCardSeriesRequest $request): CardSeriesResource | JsonResponse
    {
        try {
            $series = $this->cardSeriesService->create($request->validated());
        } catch (E $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return new CardSeriesResource($series);
    }
}
