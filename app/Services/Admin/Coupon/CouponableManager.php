<?php

namespace App\Services\Admin\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponableEntityDoesNotExistException;
use App\Services\Admin\Coupon\Contracts\CouponableEntityInterface;
use App\Services\Admin\Coupon\Couponables\CouponablePaymentPlanService;
use App\Services\Admin\Coupon\Couponables\CouponableUserService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class CouponableManager implements Contracts\CouponableManagerInterface
{
    protected const ENTITY_CLASS_NAMESPACE = '\App\Services\Admin\Coupon\Couponables\\';
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
     * @throws CouponableEntityDoesNotExistException
     */
    protected function getEntity(string $entity): CouponableEntityInterface
    {
        $entityClass = 'Couponable' . Str::singular(Str::Title(Str::camel($entity))) . 'Service';

        if (! class_exists(self::ENTITY_CLASS_NAMESPACE . $entityClass)) {
            throw new CouponableEntityDoesNotExistException;
        }
        $service = new (self::ENTITY_CLASS_NAMESPACE . $entityClass)();

        return $this->entities[$entity] = $service;
    }
}
