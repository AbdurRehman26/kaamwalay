<?php

namespace App\Services\Salesman\Coupon\Couponables;

use App\Http\Resources\API\V2\Salesman\Coupon\Couponable\CustomerCollection;
use App\Models\Coupon;
use App\Models\User;
use App\Services\Salesman\Coupon\Contracts\CouponableEntityInterface;

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

    public function get(): CustomerCollection
    {
        $customers = User::customer()->get();

        return new CustomerCollection($customers);
    }
}
