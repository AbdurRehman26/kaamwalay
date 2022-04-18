<?php

namespace App\Http\Resources\API\V2\Admin\Coupon;

use App\Http\Resources\API\BaseResource;
use App\Models\User;

/** @mixin User */
class CouponUserResource extends BaseResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
        ];
    }
}
