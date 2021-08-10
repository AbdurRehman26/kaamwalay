<?php

namespace App\Http\Resources\API\Customer\Order;

use App\Http\Resources\API\Customer\Order\PaymentPlan\PaymentPlanResource;
use App\Http\Resources\API\Customer\Order\ShippingMethod\ShippingMethodShowResource;
use App\Http\Resources\API\Customer\User\UserResource;
use Carbon\Carbon;
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
            'number_of_cards' => $this->orderItems->count(),
            'total_declared_value' => $this->grand_total,
            'created_at' => Carbon::parse($this->created_at)->toDate(),
            'customer' => new UserResource($this->user),
            'shipping_method' => new ShippingMethodShowResource($this->shippingMethod),
            'service_level' => new PaymentPlanResource($this->paymentPlan),
            'order_address' => new OrderAddressResource($this->orderAddress),
        ];
    }
}
