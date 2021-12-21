<?php

namespace App\Services\Admin\Coupon\Contracts;

interface CouponableManagerInterface
{
    public function entity(string $entity): CouponableEntityInterface;
}
