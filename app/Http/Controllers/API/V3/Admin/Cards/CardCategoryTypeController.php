<?php

namespace App\Http\Controllers\API\V3\Admin\Cards;
use App\Http\Resources\API\V3\Admin\Card\CardCategoryTypeResource;
use App\Models\CardCategoryType;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CardCategoryTypeController
{
    public function index(): AnonymousResourceCollection
    {
        return CardCategoryTypeResource::collection(
            CardCategoryType::all()
        );
    }
}
