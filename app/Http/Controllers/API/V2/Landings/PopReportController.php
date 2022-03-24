<?php

namespace App\Http\Controllers\API\V2\Landings;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Customer\CardCategory\CardCategoryCollection;
use App\Http\Resources\API\V2\Customer\CardCategory\CardCategoryResource;
use App\Http\Resources\API\V2\Customer\CardSeries\CardSeriesResource;
use App\Http\Resources\API\V2\Customer\CardSet\CardSetResource;
use App\Http\Resources\API\V2\PopReport\PopReportsCard\PopReportsCardResource;
use App\Http\Resources\API\V2\PopReport\PopReportsSeries\PopReportsSetCollection;
use App\Http\Resources\API\V2\PopReport\PopReportsSeries\PopReportsSeriesResource;
use App\Http\Resources\API\V2\PopReport\PopReportsSet\PopReportsSetResource;
use App\Models\CardCategory;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\PopReport\PopReportService;
use Illuminate\Http\JsonResponse;

class PopReportController extends Controller
{
    public function __construct(protected PopReportService $popReportService)
    {
    }

    public function getCategories(): CardCategoryCollection
    {
        $categories = CardCategory::enabled()->get();

        return new CardCategoryCollection($categories);
    }

    public function getSeriesReport(CardCategory $cardCategory): JsonResponse
    {
        $data = $this->popReportService->getSeriesReport($cardCategory);

        $data->getCollection()->transform(function ($item) {
            return new PopReportsSeriesResource($item);
        });

        $totalPopulation = $this->popReportService->getSeriesTotalPopulation($cardCategory);

        return new JsonResponse([
            'items' => $data,
            'total_population' => $totalPopulation,
            'card_category' => new CardCategoryResource($cardCategory),
        ], 200);
    }

    public function getSetsReport(CardCategory $cardCategory, CardSeries $cardSeries): JsonResponse
    {
        $data = $this->popReportService->getSetsReport($cardSeries);

        $data->getCollection()->transform(function ($item) {
            return new PopReportsSetResource($item);
        });

        $totalPopulation = $this->popReportService->getSetsTotalPopulation($cardSeries);

        return new JsonResponse([
            'items' => $data,
            'total_population' => $totalPopulation,
            'card_category' => new CardCategoryResource($cardCategory),
            'card_series' => new CardSeriesResource($cardSeries),
        ], 200);
    }

    public function getCardsReport(CardCategory $cardCategory, CardSeries $cardSeries, CardSet $cardSet): JsonResponse
    {
        $data = $this->popReportService->getCardsReport($cardSet);

        $data->getCollection()->transform(function ($item) {
            return new PopReportsCardResource($item);
        });

        $totalPopulation = $this->popReportService->getCardProductsTotalPopulation($cardSet);

        return new JsonResponse([
            'items' => $data,
            'total_population' => $totalPopulation,
            'card_category' => new CardCategoryResource($cardCategory),
            'card_series' => new CardSeriesResource($cardSeries),
            'card_set' => new CardSetResource($cardSet),
        ], 200);
    }
}
