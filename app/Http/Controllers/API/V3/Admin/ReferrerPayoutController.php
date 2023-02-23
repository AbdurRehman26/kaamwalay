<?php

namespace App\Http\Controllers\API\V3\Admin;

use App\Events\API\Admin\ReferralProgram\BatchPayoutCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V3\Admin\ReferrerPayout\ProcessReferrerPayoutsRequest;
use App\Http\Resources\API\V3\Admin\ReferralProgram\ReferrerPayout\ReferrerPayoutListCollection;
use App\Services\Admin\V3\ReferralProgram\ReferrerPayoutService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class ReferrerPayoutController extends Controller
{
    public function __construct(protected ReferrerPayoutService $referrerPayoutService)
    {
    }

    public function index(): ReferrerPayoutListCollection
    {
        return new ReferrerPayoutListCollection($this->referrerPayoutService->list());
    }

    public function store(ProcessReferrerPayoutsRequest $request): JsonResponse
    {
        $this->referrerPayoutService->initiateBatchPayout($request->validated());

        BatchPayoutCreated::dispatch($request->validated());

        return new JsonResponse(['success' => true], Response::HTTP_CREATED);
    }
}
