<?php

namespace App\Services\Admin\Coupon\Contracts;

use App\Models\Coupon;

interface CouponableEntityInterface
{
    public function getRelationKey(): string;

    public function setIds(array $ids): self;

    public function save(Coupon $coupon): Coupon;
}
