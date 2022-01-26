<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Models\CardCategory;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\PopReport\PopReportService;
use Illuminate\View\View;

class PopReportController extends Controller
{
    public function __construct(protected PopReportService $popReportService)
    {
    }

    public function index(): View
    {
        $categories = CardCategory::limit(4)->get();

        return view('landings.pop.index', compact('categories'));
    }

    public function getSeriesReport(CardCategory $cardCategory): View
    {
        $data = $this->popReportService->getSeriesReport($cardCategory);

        $totalPopulation = $this->popReportService->getSeriesTotalPopulation($cardCategory);

        return view('landings.pop.report', compact('data', 'totalPopulation', 'cardCategory'));
    }

    public function getSetsReport(CardCategory $cardCategory, CardSeries $cardSeries): View
    {
        $data = $this->popReportService->getSetsReport($cardSeries);

        $totalPopulation = $this->popReportService->getSetsTotalPopulation($cardSeries);

        return view('landings.pop.series', compact('data', 'totalPopulation', 'cardCategory', 'cardSeries'));
    }

    public function getCardsReport(CardCategory $cardCategory, CardSeries $cardSeries, CardSet $cardSet): View
    {
        $data = $this->popReportService->getCardsReport($cardSet);

        $totalPopulation = $this->popReportService->getCardProductsTotalPopulation($cardSet);

        return view('landings.pop.set', compact('data', 'totalPopulation', 'cardCategory', 'cardSeries', 'cardSet'));
    }
}
