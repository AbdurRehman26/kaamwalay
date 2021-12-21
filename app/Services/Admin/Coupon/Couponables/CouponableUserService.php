<?php

namespace App\Services\Admin\Coupon\Couponables;

use App\Models\Coupon;
use App\Services\Admin\Coupon\Contracts\CouponableEntityInterface;

class CouponableUserService implements CouponableEntityInterface
{
    protected array $ids = [];

    public function getRelationKey(): string
    {
        return 'users';
    }

    public function setIds(array $ids): self
    {
        $this->ids = $ids;

        return $this;
    }

    public function save(Coupon $coupon): Coupon
    {
        $coupon->users()->sync($this->ids);

        return $coupon;
    }
}
