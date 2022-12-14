<?php

namespace App\Http\Controllers\API\V2\Salesman\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponableEntitiesNotAvailableException;
use App\Exceptions\API\Admin\Coupon\CouponableEntityDoesNotExistException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\V2\Salesman\Coupon\CouponableEntityRequest;
use App\Models\CouponApplicable;
use App\Services\Admin\Coupon\CouponService;
use Countable;
use IteratorAggregate;

class CouponableEntityController extends Controller
{
    /**
     * @throws CouponableEntitiesNotAvailableException|CouponableEntityDoesNotExistException
     */
    public function __invoke(CouponableEntityRequest $request, CouponService $couponService): Countable|IteratorAggregate
    {
        if (! isset(CouponApplicable::ENTITIES_MAPPING[$request->input('coupon_applicable_id')])) {
            throw new CouponableEntitiesNotAvailableException;
        }

        return $couponService->getCouponableEntities($request->input('coupon_applicable_id'));
    }
}
