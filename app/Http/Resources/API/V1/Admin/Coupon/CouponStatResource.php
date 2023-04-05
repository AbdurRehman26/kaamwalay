<?php

namespace App\Http\Resources\API\V1\Admin\Coupon;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class CouponStatResource extends BaseResource
{
    /**
     * Transform the resource into an array.
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
