<?php

namespace App\Http\Resources\API\V2\Admin\Coupon;

use Illuminate\Http\Resources\Json\ResourceCollection;

class CouponLogCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable<int,mixed>|\JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
