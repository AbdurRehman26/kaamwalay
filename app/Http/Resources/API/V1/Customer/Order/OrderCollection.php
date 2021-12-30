<?php

namespace App\Http\Resources\API\V1\Customer\Order;

use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderCollection extends ResourceCollection
{
    public $collects = OrderListResource::class;

    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}
