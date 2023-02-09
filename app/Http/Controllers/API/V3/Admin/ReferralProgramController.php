<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\ReferralProgram\GetReferralProgramStatRequest;
use App\Http\Requests\API\V3\Admin\ReferralProgram\ListRefereesRequest;
use App\Http\Resources\API\V3\Admin\ReferralProgram\Referee\RefereeCollection;
use App\Services\Admin\V3\ReferralProgramService;
use Illuminate\Http\JsonResponse;

class ReferralProgramController extends Controller
{
    public function __construct(protected ReferralProgramService $referralProgramService)
    {
    }

    public function getStat(GetReferralProgramStatRequest $request): JsonResponse
    {
        return new JsonResponse([ 'data' => $this->referralProgramService->getStat($request->validated())]);
    }

    public function listReferees(ListRefereesRequest $request): RefereeCollection
    {
        return new RefereeCollection($this->referralProgramService->getReferees());
    }

}
