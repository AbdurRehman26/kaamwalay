<?php

namespace App\Http\Resources\API\V3\Customer\Order\OrderPaymentPlan;

use App\Http\Resources\API\BaseResource;
use App\Models\PaymentPlan;
use Illuminate\Http\Request;

/** @mixin PaymentPlan */
class OrderPaymentPlanResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'price' => $this->price,
            'price_before_discount' => $this->price_before_discount,
            'discount_percentage' => $this->discount_percentage,
            'max_protection_amount' => $this->max_protection_amount,
            'turnaround' => $this->turnaround,
        ];
    }
}
