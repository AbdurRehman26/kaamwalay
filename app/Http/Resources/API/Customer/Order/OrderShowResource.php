<?php

namespace App\Http\Resources\API\Customer\Order;

use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderShowResource extends JsonResource
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
            'order_number' => $this->order_number,
            'shipping_method' => $this->shippingMethod->name,
            'number_of_cards' => $this->orderItems->count(),
            'created_at' => $this->created_at,
            'total_declared_value' => $this->grand_total,
            'service_level' => new PaymentPlanResource($this->paymentPlan),
            'order_address' => new OrderAddressResource($this->orderAddress),

        ];
    }
}
