<?php

namespace App\Http\Controllers\API\V1\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V1\CardSeries\CardSeriesCollection;
use App\Services\Admin\Card\CardSeriesService;

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
}
