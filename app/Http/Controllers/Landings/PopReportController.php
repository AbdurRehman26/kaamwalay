<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
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
        return view('landings.pop.report', compact('data'));
    }

    public function getSetsReport(): View
    {
        $data = $this->popReportService->getSetsReport();

        return view('landings.pop.series', compact('data'));
    }

    public function getCardsReport(): View
    {
        $data = $this->popReportService->getCardsReport();

        return view('landings.pop.set', compact('data'));
    }
}
