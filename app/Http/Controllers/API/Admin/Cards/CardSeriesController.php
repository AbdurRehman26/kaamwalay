<?php

namespace App\Http\Controllers\API\Admin\Cards;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\CardSeries\CardSeriesCollection;
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
