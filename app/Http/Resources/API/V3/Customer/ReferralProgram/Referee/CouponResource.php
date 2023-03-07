<?php

namespace App\Http\Resources\API\V3\Customer\ReferralProgram\Referee;

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
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'available_from' => $this->available_from,
            'available_till' => $this->available_till,
            'discount_value' => $this->discount_value,
        ];
    }
}
