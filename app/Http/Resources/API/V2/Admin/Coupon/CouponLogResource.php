<?php

namespace App\Http\Resources\API\V2\Admin\Coupon;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\Coupon\Couponable\CustomerResource;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;

/**
 * @property mixed $user
 * @property mixed $order
 */
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
