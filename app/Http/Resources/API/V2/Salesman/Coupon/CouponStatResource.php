<?php

namespace App\Http\Resources\API\V2\Salesman\Coupon;

use App\Http\Resources\API\BaseResource;

/**
 * @property int $times_used
 * @property int $total_cards
 * @property float $total_discount
 * @property float $total_revenue
 */
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
            'times_used' => $this->times_used,
            'total_cards' => $this->total_cards,
            'total_discount' => $this->total_discount,
            'total_revenue' => $this->total_revenue,
        ];
    }
}