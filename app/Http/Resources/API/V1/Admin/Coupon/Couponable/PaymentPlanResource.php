<?php

namespace App\Http\Resources\API\V1\Admin\Coupon\Couponable;

use App\Http\Resources\API\BaseResource;

class PaymentPlanResource extends BaseResource
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
        ];
    }
}
