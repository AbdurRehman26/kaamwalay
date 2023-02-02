<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V3\Admin\Referral\CommissionEarningCollection;
use App\Http\Requests\API\V3\Admin\Referral\GetReferralStatRequest;
use App\Http\Requests\API\V3\Admin\Referral\SetReferrerStatusRequest;
use App\Http\Resources\API\V3\Admin\Referral\ReferrerResource;
use App\Http\Resources\API\V3\Admin\Referral\ReferrerSignUpCollection;
use App\Models\User;
use App\Services\Referrer\ReferrerService;
use Illuminate\Http\JsonResponse;

class ReferralController extends Controller
{
    public function __construct(protected ReferrerService $referrerService)
    {
    }

    public function getSignUps(User $user): ReferrerSignUpCollection
    {
        return new ReferrerSignUpCollection($this->referrerService->getSignUps($user->id));
    }

    public function getCommissionEarnings(User $user): CommissionEarningCollection
    {
        return new CommissionEarningCollection($this->referrerService->getCommissionEarnings($user->id));
    }

    /**
     * @throws Throwable
     */
    public function setReferrersStatus(SetReferrerStatusRequest $request, User $user): ReferrerResource
    {
        return new ReferrerResource($this->referrerService->setReferrersStatus($user, $request->validated()));
    }

    public function getStat(GetReferralStatRequest $request, User $user): JsonResponse
    {
        return new JsonResponse([ 'data' => $this->referrerService->getStat($user, $request->validated())]);
    }
}
