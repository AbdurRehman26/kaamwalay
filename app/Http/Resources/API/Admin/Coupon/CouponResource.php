<?php

namespace App\Http\Resources\API\Admin\Coupon;

use App\Http\Resources\API\BaseResource;

class CouponResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
