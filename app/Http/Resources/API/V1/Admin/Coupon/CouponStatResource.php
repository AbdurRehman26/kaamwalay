<?php

namespace App\Http\Resources\API\V1\Admin\Coupon;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;

class CouponStatResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'times_used' => $this->times_used,
            'total_discount' => $this->total_discount,
            'total_revenue' => $this->total_revenue,
        ];
    }
}
