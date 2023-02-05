<?php

namespace App\Http\Controllers\API\V3\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\V3\Customer\Referee\CouponResource;
use App\Services\RefereeCouponService;
use Exception;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class RefereeCouponController extends Controller
{
    public function show(RefereeCouponService $refereeCouponService): JsonResponse | CouponResource
    {
        try {
            return new CouponResource($refereeCouponService->getRefereeCoupon());
        }catch (Exception $e){
            return new JsonResponse(
                [
                    'error' => $e->getMessage(),
                ],
                Response::HTTP_BAD_REQUEST
            );
        }
    }
}
