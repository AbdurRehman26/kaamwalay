<?php

namespace App\Http\Resources\API\V3\Customer\Coupon;

use App\Http\Resources\API\BaseResource;
use App\Models\Coupon;
use Illuminate\Http\Request;

/** @mixin Coupon */
class CouponResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'discount_statement' => $this->description,
        ];
    }
}
