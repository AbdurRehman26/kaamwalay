<?php

namespace App\Http\Resources\API\V2\Admin\Order;

use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderPaymentCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable<string,mixed>|\JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
