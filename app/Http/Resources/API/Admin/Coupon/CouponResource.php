<?php

namespace App\Http\Resources\API\Admin\Coupon;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\Customer\User\UserResource;

class CouponResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'type' => $this->type,
            'discount_statement' => $this->discountStatement(),
            'discount_value' => $this->discount_value,
            'coupon_applicable_id' => $this->coupon_applicable_id,
            'coupon_status_id' => $this->coupon_status_id,
            'available_from' => $this->available_from,
            'available_till' => $this->available_till,
            'is_permanent' => is_null($this->available_till),
            'coupon_applicable' => $this->whenLoaded('couponApplicable', CouponApplicableResource::class),
            'coupon_status' => $this->whenLoaded('couponStatus', CouponStatusResource::class),
            'payment_plans' => $this->whenLoaded('paymentPlans', PaymentPlanResource::class),
            'users' => $this->whenLoaded('users', UserResource::class),
        ];
    }

    protected function discountStatement(): string
    {
        return match ($this->type) {
            'percentage' => (int) $this->discount_value . '% Off ' . $this->couponApplicable?->label ?: '',
            default => $this->discount_value . ' Off',
        };
    }
}
