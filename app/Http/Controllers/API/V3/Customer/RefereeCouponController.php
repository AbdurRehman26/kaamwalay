<?php

namespace App\Http\Controllers\API\V3\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V3\Customer\Referee\CouponResource;
use App\Services\RefereeCouponService;
use Illuminate\Http\JsonResponse;

class RefereeCouponController extends Controller
{
    public function show(RefereeCouponService $refereeCouponService)
    {
        return new CouponResource($refereeCouponService->markCouponAsViewedAndReturn());
    }
}
