<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\GetReferralProgramStatRequest;
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

}
