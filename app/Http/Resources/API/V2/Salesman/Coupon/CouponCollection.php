<?php

namespace App\Http\Resources\API\V2\Salesman\Coupon;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CouponCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    // @phpstan-ignore-next-line
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
