<?php

namespace App\Http\Resources\API\V2\Admin\Coupon;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\Coupon\Couponable\CustomerCollection;
use App\Http\Resources\API\V2\Admin\Coupon\Couponable\PaymentPlanCollection;
use App\Models\Coupon;
use Illuminate\Http\Request;

/** @mixin Coupon */
class CouponResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
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
            'available_till' => $this->available_till?->toDateString(),
            'is_permanent' => is_null($this->available_till),
            'usage_allowed_per_user' => $this->usage_allowed_per_user,
            'coupon_applicable' => $this->whenLoaded('couponApplicable', CouponApplicableResource::class),
            'coupon_status' => $this->whenLoaded('couponStatus', CouponStatusResource::class),
            'coupon_stats' => $this->whenLoaded('couponStats', CouponStatResource::class),
            'coupon_logs' => $this->whenLoaded('couponLogs', CouponLogCollection::class),
            'payment_plans' => $this->whenLoaded('paymentPlans', PaymentPlanCollection::class),
            'users' => $this->whenLoaded('users', CustomerCollection::class),
            'created_by' => $this->whenLoaded('createdBy', CouponUserResource::class),
        ];
    }
}
