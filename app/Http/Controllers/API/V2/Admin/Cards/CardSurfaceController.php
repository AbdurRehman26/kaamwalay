<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Admin\CardSurface\CardSurfaceCollection;
use App\Http\Resources\API\V2\Admin\CardSurface\CardSurfaceResource;
use App\Models\CardSurface;
use App\Services\Admin\Card\CardSurfaceService;
use Illuminate\Http\Request;

class CardSurfaceController extends Controller
{
    public function __construct(CardSurfaceService $cardSurfaceService)
    {
    }
    
    public function index()
    {
        return new CardSurfaceCollection($this->cardSurfaceService->getCardSurfaces());
    }

    public function create()
    {
        return new CardSurfaceResource(CardSurface::create($request->validated()));
    }

    public function store(Request $request)
    {
        //
    }

    public function show($id)
    {
        //
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

}
