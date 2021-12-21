<?php

namespace App\Services\Admin\Coupon\Couponables;

use App\Models\Coupon;
use App\Services\Admin\Coupon\Contracts\CouponableEntityInterface;

class CouponablePaymentPlanService implements CouponableEntityInterface
{
    protected array $ids = [];

    public function getRelationKey(): string
    {
        return 'paymentPlans';
    }

    public function setIds(array $ids): self
    {
        $this->ids = $ids;

        return $this;
    }

    public function save(Coupon $coupon): Coupon
    {
        $coupon->paymentPlans()->sync($this->ids);

        return $coupon;
    }
}
