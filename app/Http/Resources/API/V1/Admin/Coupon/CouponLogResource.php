<?php

namespace App\Http\Resources\API\V1\Admin\Coupon;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\Admin\Coupon\Couponable\CustomerResource;
use App\Http\Resources\API\V1\Admin\Order\OrderResource;

class CouponLogResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'user' => new CustomerResource($this->user),
            'order' => new OrderResource($this->order),
        ];
    }
}
