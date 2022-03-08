<?php

namespace App\Http\Resources\API\V2\Admin\Coupon\Couponable;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PaymentPlanCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable<string, mixed>|\JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
