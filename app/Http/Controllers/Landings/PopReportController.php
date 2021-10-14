<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
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

    public function getSetsReport(int $seriesId): View
    {
        $data = $this->popReportService->getSetsReport($seriesId);

        $totalPopulation = $this->popReportService->getSetsTotalPopulation($seriesId);

        return view('landings.pop.series', compact('data', 'totalPopulation'));
    }

    public function getCardsReport(int $seriesId, int $setId): View
    {
        $data = $this->popReportService->getCardsReport($setId);

        $totalPopulation = $this->popReportService->getCardProductsTotalPopulation($setId);

        return view('landings.pop.set', compact('data', 'totalPopulation'));
    }
}
