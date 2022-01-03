<?php

namespace App\Services\Admin\Coupon\Contracts;

use App\Models\Coupon;
use Countable;
use IteratorAggregate;

interface CouponableEntityInterface
{
    public function getRelationKey(): string;

    public function setIds(array $ids): self;

    public function save(Coupon $coupon): Coupon;

    public function get(): Countable|IteratorAggregate;
}
