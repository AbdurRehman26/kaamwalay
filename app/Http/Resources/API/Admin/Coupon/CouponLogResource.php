<?php

namespace App\Http\Resources\API\Admin\Coupon;

use App\Http\Resources\API\Admin\Coupon\Couponable\CustomerResource;
use App\Http\Resources\API\Admin\Order\OrderResource;
use App\Http\Resources\API\BaseResource;

class CouponLogResource extends BaseResource
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
            'user' => new CustomerResource($this->user),
            'order' => new OrderResource($this->order),
        ];
    }
}
