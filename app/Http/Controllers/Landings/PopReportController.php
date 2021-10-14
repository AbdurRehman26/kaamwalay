<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Models\PopSeriesReport;
use App\Services\PopReport\PopReportService;
use Illuminate\View\View;

class PopReportController extends Controller
{
    public function __construct(protected PopReportService $popReportService)
    {
    }

    public function getSeriesReport(): View
    {
        $data = $this->popReportService->getSeriesReport();

        $totalPopulation = $this->popReportService->getSeriesTotalPopulation();

        return view('landings.pop.report', compact('data', 'totalPopulation'));
    }

    public function getSetsReport(CardSeries $cardSeries): View
    {
        $data = $this->popReportService->getSetsReport($cardSeries->id);

        $totalPopulation = $this->popReportService->getSetsTotalPopulation($cardSeries->id);

        return view('landings.pop.series', compact('data', 'totalPopulation', 'cardSeries'));
    }

    public function getCardsReport(CardSeries $cardSeries, CardSet $cardSet): View
    {
        $data = $this->popReportService->getCardsReport($cardSet->id);

        $totalPopulation = $this->popReportService->getCardProductsTotalPopulation($cardSet->id);

        return view('landings.pop.set', compact('data', 'totalPopulation', 'cardSet'));
    }
}
