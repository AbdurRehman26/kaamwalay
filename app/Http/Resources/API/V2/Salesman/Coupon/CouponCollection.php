<?php

namespace App\Http\Resources\API\V2\Salesman\Coupon;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class CouponCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    // @phpstan-ignore-next-line
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
