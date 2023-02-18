<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V3\Admin\ReferralProgram\ReferrerPayout\ReferrerPayoutListCollection;
use App\Services\Admin\V3\ReferralProgram\ReferrerPayoutService;

class ReferrerPayoutController extends Controller
{
    public function __construct(protected ReferrerPayoutService $referrerPayoutService)
    {
    }

    public function index(): ReferrerPayoutListCollection
    {
        return new ReferrerPayoutListCollection($this->referrerPayoutService->list());
    }

}
