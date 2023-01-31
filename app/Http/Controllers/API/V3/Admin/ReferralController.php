<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V3\Admin\Referral\CommissionEarningCollection;
use App\Http\Resources\API\V3\Admin\Referral\ReferrerSignUpCollection;
use App\Services\Admin\V3\ReferrerService;

class ReferralController extends Controller
{
    public function __construct(protected ReferrerService $referrerService)
    {
    }

    public function getSignUps(): ReferrerSignUpCollection
    {
        return new ReferrerSignUpCollection($this->referrerService->getSignUps());
    }

    public function getCommissionEarnings(): CommissionEarningCollection
    {
        return new CommissionEarningCollection($this->referrerService->getCommissionEarnings());
    }
}
