<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\CardSurface\StoreCardSurfaceRequest;
use App\Http\Requests\API\V2\Admin\CardSurface\UpdateCardSurfaceRequest;
use App\Http\Resources\API\V2\Admin\CardSurface\CardSurfaceCollection;
use App\Http\Resources\API\V2\Admin\CardSurface\CardSurfaceResource;
use App\Models\CardSurface;
use App\Services\Admin\Card\CardSurfaceService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class CardSurfaceController extends Controller
{
    public function __construct(private CardSurfaceService $cardSurfaceService)
    {
    }

    public function index(): CardSurfaceCollection
    {
        return new CardSurfaceCollection($this->cardSurfaceService->getCardSurfaces());
    }

    public function store(StoreCardSurfaceRequest $request): CardSurfaceResource
    {
        return new CardSurfaceResource(CardSurface::create($request->validated()));
    }

    public function show(CardSurface $surface): CardSurfaceResource
    {
        return new CardSurfaceResource($surface);
    }

    public function update(CardSurface $surface, UpdateCardSurfaceRequest $request): JsonResponse
    {
        try {
            $surface->update($request->validated());
        } catch (ModelNotFoundException) {
            return new JsonResponse(
                [
                    'error' => 'Card Surface does not exist',
                ],
                Response::HTTP_BAD_REQUEST
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Card Surface Updated successfully.',
        ]);
    }
}
