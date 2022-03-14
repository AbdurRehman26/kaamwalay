<?php

namespace App\Http\Resources\API\V2\Customer\Coupon;

use App\Http\Resources\API\BaseResource;
use App\Models\Coupon;
use Illuminate\Http\Request;

/** @mixin Coupon */
class CouponResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'discount_statement' => $this->description,
        ];
    }
}
