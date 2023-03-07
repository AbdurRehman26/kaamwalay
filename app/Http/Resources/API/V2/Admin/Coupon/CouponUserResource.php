<?php

namespace App\Http\Resources\API\V2\Admin\Coupon;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;
use App\Models\User;

/** @mixin User */
class CouponUserResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
        ];
    }
}
