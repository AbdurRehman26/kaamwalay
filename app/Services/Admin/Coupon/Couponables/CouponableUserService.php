<?php

namespace App\Services\Admin\Coupon\Couponables;

use App\Http\Resources\API\Admin\Coupon\Couponable\CustomerCollection;
use App\Models\Coupon;
use App\Models\User;
use App\Services\Admin\Coupon\Contracts\CouponableEntityInterface;
use Countable;
use IteratorAggregate;

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
        $customers = User::customers()->get();

        return new CustomerCollection($customers);
    }
}
