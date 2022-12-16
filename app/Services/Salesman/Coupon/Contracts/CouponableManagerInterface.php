<?php

namespace App\Services\Salesman\Coupon\Contracts;

interface CouponableManagerInterface
{
    public function entity(string $entity): CouponableEntityInterface;
}
