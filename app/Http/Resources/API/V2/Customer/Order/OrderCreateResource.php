<?php

namespace App\Http\Resources\API\V2\Customer\Order;

use App\Http\Resources\API\V1\Customer\Order\OrderCreateResource as V1OrderCreateResource;

class OrderCreateResource extends V1OrderCreateResource
{
    public function toArray($request): array
    {
        $array = parent::toArray($request);
        $array['order_step'] = $this->order_step;
        return $array;
    }
}
