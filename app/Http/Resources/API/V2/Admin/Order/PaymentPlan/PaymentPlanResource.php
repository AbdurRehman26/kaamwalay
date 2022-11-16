<?php

namespace App\Http\Resources\API\V2\Admin\Order\PaymentPlan;

use App\Models\PaymentPlan;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PaymentPlan */
class PaymentPlanResource extends JsonResource
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
            'price' => $this->price,
            'price_before_discount' => $this->price_before_discount,
            'discount_percentage' => $this->discount_percentage,
            'max_protection_amount' => $this->max_protection_amount,
            'turnaround' => $this->turnaround,
        ];
    }
}