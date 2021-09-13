<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Services\AGS\AgsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class FeedController extends Controller
{
    public function __construct(protected AgsService $agsService)
    {
    }

    public function getList():View
    {
        return view('landings.feed.list');
    }

    public function getView(string $certificateId): View
    {
        $data = $this->agsService->getGradesForPublicPage($certificateId);

        return view('landings.feed.view', $data);
    }

    public function cardRedirect(string $certificateId): RedirectResponse
    {
        return redirect(route('feed.cardView', ['certificateId' => $certificateId]));
    }
}
