<?php

namespace App\Http\Controllers\API\Admin\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponableEntitiesNotAvailableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Admin\Coupon\CouponableEntityRequest;
use App\Models\CouponApplicable;
use App\Services\Admin\Coupon\CouponService;
use Countable;
use IteratorAggregate;

class ListCouponableEntity extends Controller
{
    /**
     * @throws CouponableEntitiesNotAvailableException
     */
    public function __invoke(CouponableEntityRequest $request, CouponService $couponService): Countable|IteratorAggregate
    {
        if (! isset(CouponApplicable::ENTITIES_MAPPING[$request->get('coupon_applicable_id')])) {
            throw new CouponableEntitiesNotAvailableException;
        }

        return $couponService->getCouponableEntities($request->get('coupon_applicable_id'));
    }
}
