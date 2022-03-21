<?php

namespace App\Http\Resources\API\V2\Customer\Order\ShippingMethod;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ShippingMethodCollection extends ResourceCollection
{
    /**
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable<string, mixed>|\JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
