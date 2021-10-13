<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Models\CardSeries;
use App\Models\CardSet;
use App\Services\AGS\AgsService;
use App\Services\Order\UserCardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PopReportController extends Controller
{
    public function __construct(protected AgsService $agsService, protected UserCardService $userCardService)
    {
    }

    public function getReport(): View
    {
        // $data = $this->userCardService->getFeedCards();

        $data = [];
        return view('landings.pop.report',compact('data'));
    }

    public function getSeriesReport(CardSeries $cardSeries): View
    {
        // $data = $this->userCardService->getFeedCards();

        $data = [];
        return view('landings.pop.series',compact('data'));
    }

    public function getSetReport(CardSeries $cardSeries, CardSet $cardSet): View
    {
        // $data = $this->userCardService->getFeedCards();

        $data = [];
        return view('landings.pop.set',compact('data'));
    }
}
