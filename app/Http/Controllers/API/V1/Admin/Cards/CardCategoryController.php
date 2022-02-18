<?php

namespace App\Http\Controllers\API\V1\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\Admin\CardCategory\CardCategoryCollection;
use App\Services\Admin\Card\CardCategoryService;

class CardCategoryController extends Controller
{
    public function __construct(protected CardCategoryService $cardCategoryService)
    {
    }

    public function index(): CardCategoryCollection
    {
        return new CardCategoryCollection(
            $this->cardCategoryService->search()
        );
    }
}
