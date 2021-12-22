<?php

namespace App\Http\Controllers\API\V1\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\CardSet\CardSetCollection;
use App\Services\Admin\Card\CardSetService;

class CardSetController extends Controller
{
    public function __construct(protected CardSetService $cardSetService)
    {
    }

    public function index(): CardSetCollection
    {
        return new CardSetCollection(
            $this->cardSetService->search()
        );
    }
}
