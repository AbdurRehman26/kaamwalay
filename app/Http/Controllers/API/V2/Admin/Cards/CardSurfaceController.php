<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Admin\CardSurface\StoreCardSurfaceRequest;
use App\Http\Resources\API\V2\Admin\CardSurface\CardSurfaceCollection;
use App\Http\Resources\API\V2\Admin\CardSurface\CardSurfaceResource;
use App\Models\CardSurface;
use App\Services\Admin\Card\CardSurfaceService;

class CardSurfaceController extends Controller
{
    public function __construct(private CardSurfaceService $cardSurfaceService)
    {
    }
    
    public function index()
    {
        return new CardSurfaceCollection($this->cardSurfaceService->getCardSurfaces());
    }

    public function store(StoreCardSurfaceRequest $request)
    {
        return new CardSurfaceResource(CardSurface::create($request->validated()));
    }

    public function show(CardSurface $surface): CardSurfaceResource
    {   
        return new CardSurfaceResource($surface);
    }

    public function update(int $cardSurfaceId, StoreCardSurfaceRequest $request)
    {
        CardSurface::where('id', $cardSurfaceId)->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Card Surface Updated successfully.',
        ]);
    }

}
