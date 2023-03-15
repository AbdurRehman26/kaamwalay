<?php

namespace App\Http\Resources\API\V2\Salesman\Order\ShippingMethod;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ShippingMethodCollection extends ResourceCollection
{
    /**
     * @return array|\Illuminate\Contracts\Support\Arrayable<string,mixed>|\JsonSerializable
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
