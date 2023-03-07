<?php

namespace App\Http\Resources\API\V2\Admin\Coupon;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\Coupon\Couponable\CustomerResource;
use App\Http\Resources\API\V2\Admin\Order\OrderResource;
use Illuminate\Http\Request;

/**
 * @property mixed $user
 * @property mixed $order
 */
class CouponLogResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'user' => new CustomerResource($this->user),
            'order' => new OrderResource($this->order),
        ];
    }
}
