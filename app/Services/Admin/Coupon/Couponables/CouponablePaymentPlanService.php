<?php

namespace App\Services\Admin\Coupon\Couponables;

use App\Http\Resources\API\V1\Admin\Coupon\Couponable\PaymentPlanCollection;
use App\Models\Coupon;
use App\Models\PaymentPlan;
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

    public function get(): PaymentPlanCollection
    {
        $paymentPlans = PaymentPlan::orderBy('display_position')->get();

        return new PaymentPlanCollection($paymentPlans);
    }
}
