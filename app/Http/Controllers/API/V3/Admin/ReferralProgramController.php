<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\ReferralProgram\GetReferralProgramStatRequest;
use App\Http\Requests\API\V3\Admin\ReferralProgram\GetReferralStatRequest;
use App\Http\Requests\API\V3\Admin\ReferralProgram\ListRefereesRequest;
use App\Http\Requests\API\V3\Admin\ReferralProgram\ListReferrersRequest;
use App\Http\Requests\API\V3\Admin\ReferralProgram\SetReferrerStatusRequest;
use App\Http\Resources\API\V3\Admin\ReferralProgram\Order\OrderListResource;
use App\Http\Resources\API\V3\Admin\ReferralProgram\Referee\RefereeResource;
use App\Http\Resources\API\V3\Admin\ReferralProgram\Referrer\CommissionEarningCollection;
use App\Http\Resources\API\V3\Admin\ReferralProgram\Referrer\ReferrerResource;
use App\Http\Resources\API\V3\Admin\ReferralProgram\Referrer\ReferrerSignUpCollection;
use App\Http\Resources\API\V3\Admin\ReferralProgram\User\ReferrerUserResource;
use App\Models\User;
use App\Services\Admin\V3\ReferralProgramService;
use App\Services\ReferralProgram\ReferrerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReferralProgramController extends Controller
{
    public function __construct(protected ReferrerService $referrerService, protected ReferralProgramService $referralProgramService)
    {
    }

    public function getOverviewStat(GetReferralProgramStatRequest $request): JsonResponse
    {
        return new JsonResponse(['data' => $this->referralProgramService->getStat($request->validated())]);
    }

    public function listReferrers(ListReferrersRequest $request): AnonymousResourceCollection
    {
        return ReferrerUserResource::collection($this->referralProgramService->getReferrers());
    }

    public function listReferees(ListRefereesRequest $request): AnonymousResourceCollection
    {
        return RefereeResource::collection($this->referralProgramService->getReferees());
    }

    public function listReferralOrders(): AnonymousResourceCollection
    {
        return OrderListResource::collection($this->referralProgramService->getReferralOrders());
    }

    public function getSignUps(User $user): ReferrerSignUpCollection
    {
        return new ReferrerSignUpCollection($this->referrerService->getSignUps($user->id));
    }

    public function getCommissionEarnings(User $user): CommissionEarningCollection
    {
        return new CommissionEarningCollection($this->referrerService->getCommissionEarnings($user->id));
    }

    public function setReferrersStatus(SetReferrerStatusRequest $request, User $user): ReferrerResource
    {
        return new ReferrerResource($this->referrerService->setReferrersStatus($user->id, $request->validated()));
    }

    public function getReferrerStat(GetReferralStatRequest $request, User $user): JsonResponse
    {
        return new JsonResponse(['data' => $this->referrerService->getReferrerStat($user, $request->validated())]);
    }
}
