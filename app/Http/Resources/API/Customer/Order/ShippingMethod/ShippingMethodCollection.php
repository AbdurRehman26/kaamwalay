<?php

namespace App\Http\Resources\API\Customer\Order\ShippingMethod;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ShippingMethodCollection extends ResourceCollection
{
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
