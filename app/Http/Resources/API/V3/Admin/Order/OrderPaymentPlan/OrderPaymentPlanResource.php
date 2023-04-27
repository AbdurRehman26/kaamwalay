<?php

namespace App\Http\Resources\API\V3\Admin\Order\OrderPaymentPlan;

use App\Models\PaymentPlan;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PaymentPlan */
class OrderPaymentPlanResource extends JsonResource
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