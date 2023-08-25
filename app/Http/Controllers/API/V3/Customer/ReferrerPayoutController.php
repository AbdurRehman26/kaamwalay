<?php

namespace App\Http\Controllers\API\V3\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Customer\ReferralProgram\StoreReferrerPayoutRequest;
use App\Http\Resources\API\V3\Customer\Payout\ReferrerPayoutResource;
use App\Services\ReferralProgram\ReferrerPayoutService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class ReferrerPayoutController extends Controller
{
    public function index(ReferrerPayoutService $referrerPayoutService): AnonymousResourceCollection|JsonResponse
    {
        try {
            return ReferrerPayoutResource::collection($referrerPayoutService->getReferrerPayouts());
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }

    public function store(StoreReferrerPayoutRequest $request, ReferrerPayoutService $referrerPayoutService): ReferrerPayoutResource|JsonResponse
    {
        try {
            return new ReferrerPayoutResource(
                $referrerPayoutService->create($request->validated())
            );
        } catch (Exception $e) {
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
