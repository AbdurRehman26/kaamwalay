<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Events\API\Admin\ReferralProgram\BatchPayoutCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\ReferrerPayout\ProcessReferrerPayoutsRequest;
use App\Http\Resources\API\V3\Admin\ReferralProgram\ReferrerPayout\ReferrerPayoutListResource;
use App\Services\Admin\V3\ReferralProgram\ReferrerPayoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;
use Log;

class ReferrerPayoutController extends Controller
{
    public function __construct(protected ReferrerPayoutService $referrerPayoutService)
    {
    }

    public function index(): AnonymousResourceCollection
    {
        return ReferrerPayoutListResource::collection($this->referrerPayoutService->list());
    }

    public function store(ProcessReferrerPayoutsRequest $request): JsonResponse
    {
        $this->referrerPayoutService->initiateBatchPayout($request->validated());

        Log::info('BATCH_PAYOUT_INITIATED', $request->validated());

        BatchPayoutCreated::dispatch($request->validated());

        return new JsonResponse(['success' => true], Response::HTTP_CREATED);
    }
}
