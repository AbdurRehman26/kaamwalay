<?php

namespace App\Http\Controllers\API\V3\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V3\Customer\ReferralProgram\Payout\ReferrerPayoutCollection;
use App\Services\ReferralProgram\ReferrerPayoutService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ReferrerPayoutController extends Controller
{
    public function index(ReferrerPayoutService $referrerPayoutService): JsonResponse|ReferrerPayoutCollection
    {
        try {
            return new ReferrerPayoutCollection($referrerPayoutService->getReferrerPayouts());
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
