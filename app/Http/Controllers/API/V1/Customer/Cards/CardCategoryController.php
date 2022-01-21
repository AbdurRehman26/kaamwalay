<?php

namespace App\Http\Controllers\API\V1\Customer\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Customer\CardCategory\CardCategoryCollection;
use App\Models\CardCategory;

class CardCategoryController extends Controller
{
    public function __invoke(): CardCategoryCollection
    {
        $cardCategories = CardCategory::get();

        return new CardCategoryCollection($cardCategories);
    }
}
