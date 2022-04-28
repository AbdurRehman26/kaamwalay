<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Services\AGS\AgsService;
use App\Services\Order\UserCardService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class FeedController extends Controller
{
    public function __construct(protected AgsService $agsService, protected UserCardService $userCardService)
    {
    }

    public function getList(): View
    {
        $data = $this->userCardService->getFeedCards();

        return view('landings.feed.list', compact('data'));
    }

    public function getView(string $certificateId): View
    {
        $data = $this->userCardService->getDataForPublicCardPage($certificateId);

        return view('landings.feed.view', $data);
    }

    public function cardRedirect(string $certificateId): RedirectResponse
    {
        return redirect()->route('feed.view', ['certificateId' => $certificateId]);
    }
}
