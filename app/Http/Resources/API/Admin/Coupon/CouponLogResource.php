<?php

namespace App\Http\Resources\API\Admin\Coupon;

use App\Http\Resources\API\Admin\Order\OrderResource;
use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\Customer\User\UserResource;

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
            'user' => new UserResource($this->user),
            'order' => new OrderResource($this->order),
        ];
    }
}
