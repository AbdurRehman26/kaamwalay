<?php

namespace App\Http\Resources\API\V1\Admin\Coupon;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class CouponStatusResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
        ];
    }
}
