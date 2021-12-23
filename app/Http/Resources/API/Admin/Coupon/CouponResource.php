<?php

namespace App\Http\Resources\API\Admin\Coupon;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanCollection;
use App\Http\Resources\API\Customer\User\UserCollection;

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
            'description' => $this->description,
            'type' => $this->type,
            'discount_value' => $this->discount_value,
            'coupon_applicable_id' => $this->coupon_applicable_id,
            'coupon_status_id' => $this->coupon_status_id,
            'available_from' => $this->available_from->toDateString(),
            'available_till' => $this->available_till->toDateString(),
            'is_permanent' => is_null($this->available_till),
            'coupon_applicable' => $this->whenLoaded('couponApplicable', CouponApplicableResource::class),
            'coupon_status' => $this->whenLoaded('couponStatus', CouponStatusResource::class),
            'coupon_stats' => $this->whenLoaded('couponStats', CouponStatResource::class),
            'coupon_logs' => $this->whenLoaded('couponLogs', CouponLogCollection::class),
            'payment_plans' => $this->whenLoaded('paymentPlans', PaymentPlanCollection::class),
            'users' => $this->whenLoaded('users', UserCollection::class),
        ];
    }
}
