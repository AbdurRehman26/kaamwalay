<?php

namespace App\Http\Controllers\API\V1\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Admin\CardCategory\CardCategoryCollection;
use App\Models\CardCategory;

class CardCategoryController extends Controller
{
    public function index(): CardCategoryCollection
    {
        return new CardCategoryCollection(
            CardCategory::all()
        );
    }
}
