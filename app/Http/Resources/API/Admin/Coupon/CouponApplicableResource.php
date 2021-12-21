<?php

namespace App\Http\Resources\API\Admin\Coupon;

use App\Http\Resources\API\BaseResource;

class CouponApplicableResource extends BaseResource
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
            'code' => $this->code,
            'label' => $this->label,
            'api_suffix' => $this->api_suffix ?? '',
            'description' => $this->description,
            'is_active' => $this->is_active,
        ];
    }
}
