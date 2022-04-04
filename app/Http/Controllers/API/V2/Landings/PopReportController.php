<?php

namespace App\Http\Controllers\API\V2\Landings;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Landings\PopReports\CardCategory\CardCategoryCollection;
use App\Http\Resources\API\V2\Landings\PopReports\CardCategory\CardCategoryResource;
use App\Http\Resources\API\V2\Landings\PopReports\CardSeries\CardSeriesResource;
use App\Http\Resources\API\V2\Landings\PopReports\CardSet\CardSetResource;
use App\Http\Resources\API\V2\Landings\PopReports\PopReportsCard\PopReportsCardCollection;
use App\Http\Resources\API\V2\Landings\PopReports\PopReportsSeries\PopReportsSeriesCollection;
use App\Http\Resources\API\V2\Landings\PopReports\PopReportsSet\PopReportsSetCollection;
use App\Models\CardCategory;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\PopReport\PopReportService;

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

    public function getSeriesReport(CardCategory $cardCategory): PopReportsSeriesCollection
    {
        $data = $this->popReportService->getSeriesReport($cardCategory);
        $totalPopulation = $this->popReportService->getSeriesTotalPopulation($cardCategory);

        return (new PopReportsSeriesCollection($data))->additional([
            'total_population' => $totalPopulation,
            'card_category' => new CardCategoryResource($cardCategory),
        ]);
    }

    public function getSetsReport(CardCategory $cardCategory, CardSeries $cardSeries): PopReportsSetCollection
    {
        $data = $this->popReportService->getSetsReport($cardSeries);
        $totalPopulation = $this->popReportService->getSetsTotalPopulation($cardSeries);

        return (new PopReportsSetCollection($data))->additional([
            'total_population' => $totalPopulation,
            'card_category' => new CardCategoryResource($cardCategory),
            'card_series' => new CardSeriesResource($cardSeries),
        ]);
    }

    public function getCardsReport(CardCategory $cardCategory, CardSeries $cardSeries, CardSet $cardSet): PopReportsCardCollection
    {
        $data = $this->popReportService->getCardsReport($cardSet);
        $totalPopulation = $this->popReportService->getCardProductsTotalPopulation($cardSet);

        return (new PopReportsCardCollection($data))->additional([
            'total_population' => $totalPopulation,
            'card_category' => new CardCategoryResource($cardCategory),
            'card_series' => new CardSeriesResource($cardSeries),
            'card_set' => new CardSetResource($cardSet),
        ]);
    }
}
