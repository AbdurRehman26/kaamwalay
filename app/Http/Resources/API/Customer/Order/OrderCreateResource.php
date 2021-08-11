<?php

namespace App\Http\Resources\API\Customer\Order;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderCreateResource extends JsonResource
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
            'id' => $this->id,
            'order_number' => $this->order_number,
        ];
    }
}
