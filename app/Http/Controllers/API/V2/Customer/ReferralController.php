<?php

namespace App\Http\Controllers\API\V2\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V2\Customer\Referral\ReferrerResource;
use App\Http\Resources\API\V2\Customer\Referral\ReferrerSignUpCollection;
use App\Services\Referrer\ReferrerService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ReferralController extends Controller
{
    public function __construct(protected ReferrerService $referrerService)
    {
    }

    public function getReferralProfile(): JsonResponse
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
}
