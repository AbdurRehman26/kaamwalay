<?php

namespace App\Http\Resources\API\Admin\Order;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Request;

class OrderListCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}
