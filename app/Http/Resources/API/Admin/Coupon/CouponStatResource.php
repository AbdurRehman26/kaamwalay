<?php

namespace App\Http\Resources\API\Admin\Coupon;

use App\Http\Resources\API\BaseResource;

class CouponStatResource extends BaseResource
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
            'times_used_till_date' => $this->times_used_till_date,
            'total_discount_given' => $this->total_discount_given,
            'times_used_by_unique_users' => $this->times_used_by_unique_users,
            'times_used_by_all_users' => $this->times_used_by_all_users,
            'total_revenue_generated' => $this->total_revenue_generated,
        ];
    }
}
