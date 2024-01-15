<?php

namespace App\Http\Controllers\Landings;

use App\Http\Controllers\Controller;
use App\Services\Order\UserCardService;
use Illuminate\View\View;

class AutographController extends Controller
{
    public function __construct(protected UserCardService $userCardService)
    {
    }
    public function getView(string $certificateId): View
    {
        $data = $this->userCardService->getDataForPublicCardPage($certificateId);

        return view('landings.autograph.view', $data);
    }
}
