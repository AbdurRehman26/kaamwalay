<?php

namespace App\Http\Resources\API\V2\Salesman\Order\PaymentMethod;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PaymentMethodCollection extends ResourceCollection
{
    /**
     * @param \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable<string,mixed>|\JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
