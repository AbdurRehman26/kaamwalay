<?php

namespace App\Http\Resources\API\V2\Customer\Order\OrderPaymentPlan;

use App\Models\OrderPaymentPlan;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin OrderPaymentPlan */
class OrderPaymentPlanResource extends JsonResource
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
            'max_protection_amount' => $this->max_protection_amount,
            'turnaround' => $this->turnaround,
        ];
    }
}
