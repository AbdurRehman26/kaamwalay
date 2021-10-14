<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Services\PopReport\PopReportService;
use Illuminate\Support\Facades\View;

class PopReportController extends Controller
{
    public function __construct(protected PopReportService $popReportService)
    {
    }

    public function getPopReport(): View
    {
        dd(1);

        $data = $this->popReportService->getOverAllPopReport();

        return view('landings.feed.list', compact('data'));
    }

    public function getSetsReport(): View
    {
        $data = $this->popReportService->getSetsReport();

        return view('landings.feed.list', compact('data'));
    }

    public function getCardsReport(): View
    {
        $data = $this->popReportService->getCardsReport();

        return view('landings.feed.list', compact('data'));
    }
}
