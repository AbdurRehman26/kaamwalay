<?php

namespace App\Http\Controllers\API\V2\Admin\Cards;

use App\Http\Controllers\API\V1\Admin\Cards\CardProductController as V1CardProductController;
use App\Http\Resources\API\V2\CardProduct\CardProductCollection;
use App\Models\CardProduct;
use Spatie\QueryBuilder\QueryBuilder;

class CardProductController extends V1CardProductController
{
    public function index(): CardProductCollection
    {
        $cards = $this->cardProductService->getCards();

        return new CardProductCollection($cards);
    }
}
