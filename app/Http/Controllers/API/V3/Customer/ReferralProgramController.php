<?php

namespace App\Http\Controllers\API\V3\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V3\Customer\ReferralProgram\Referrer\CommissionEarningCollection;
use App\Http\Resources\API\V3\Customer\ReferralProgram\Referrer\ReferrerResource;
use App\Http\Resources\API\V3\Customer\ReferralProgram\Referrer\ReferrerSignUpCollection;
use App\Services\ReferralProgram\ReferrerService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ReferralProgramController extends Controller
{
    public function __construct(protected ReferrerService $referrerService)
    {
    }

    public function getReferrerProfile(): JsonResponse
    {
        return new JsonResponse([
            'data' => [
                'referrer' => new ReferrerResource(auth()->user()->referrer),
            ],
        ], Response::HTTP_OK);
    }

    public function getSignUps(): ReferrerSignUpCollection
    {
        return new ReferrerSignUpCollection($this->referrerService->getSignUps(auth()->user()->id));
    }

    public function getCommissionEarnings(): CommissionEarningCollection
    {
        return new CommissionEarningCollection($this->referrerService->getCommissionEarnings(auth()->user()->id));
    }
}
