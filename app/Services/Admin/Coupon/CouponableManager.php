<?php

namespace App\Services\Admin\Coupon;

use App\Exceptions\API\Admin\Coupon\CouponableEntityDoesNotExistException;
use App\Services\Admin\Coupon\Contracts\CouponableEntityInterface;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

final class CouponableManager
{
    private static ?CouponableManager $instance = null;

    public function __construct(
        protected array $entities = [],
    ) {
    }

    public static function getInstance(): self
    {
        if (is_null(self::$instance)) {
            return self::$instance = new static();
        }

        return self::$instance;
    }

    /**
     * @throws CouponableEntityDoesNotExistException
     */
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
        $entityServiceClass = $this->createEntityClassName($entity);

        if (! class_exists($entityServiceClass)) {
            throw new CouponableEntityDoesNotExistException;
        }

        return $this->entities[$entity] = new $entityServiceClass();
    }

    protected function createEntityClassName(string $entity): string
    {
        return __NAMESPACE__ . '\\Couponables\\Couponable' . Str::singular(Str::ucfirst(Str::camel($entity))) . 'Service';
    }
}
