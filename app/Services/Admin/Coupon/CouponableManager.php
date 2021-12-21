<?php

namespace App\Services\Admin\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponableEntityNotImplementedException;
use App\Services\Admin\Coupon\Contracts\CouponableEntityInterface;
use App\Services\Admin\Coupon\Couponables\CouponablePaymentPlanService;
use App\Services\Admin\Coupon\Couponables\CouponableUserService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CouponableManager implements Contracts\CouponableManagerInterface
{
    public function __construct(
        protected Application $app,
        protected array $entities = []
    ) {
    }

    public function entity(string $entity): CouponableEntityInterface
    {
        $entityService = Arr::get($this->entities, $entity);

        return $entityService ?? $this->getEntity($entity);
    }

    /**
     * @throws CouponableEntityNotImplementedException
     */
    protected function getEntity(string $entity): CouponableEntityInterface
    {
        $createMethod = 'createCouponable' . Str::singular(Str::camel($entity)) . 'Service';
        if (! method_exists($this, $createMethod)) {
            throw new CouponableEntityNotImplementedException;
        }
        $service = $this->{$createMethod}();

        return $this->entities[$entity] = $service;
    }

    protected function createCouponableUserService(): CouponableEntityInterface
    {
        return new CouponableUserService();
    }

    protected function createCouponablePaymentPlanService(): CouponableEntityInterface
    {
        return new CouponablePaymentPlanService();
    }
}
