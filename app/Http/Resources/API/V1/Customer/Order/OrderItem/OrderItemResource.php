<?php

namespace App\Http\Resources\API\V1\Customer\Order\OrderItem;

use App\Http\Resources\API\BaseResource;

class OrderItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'order_id' => $this->order_id,
            'declared_value_per_unit' => $this->declared_value_per_unit,
            'notes' => $this->notes ?? '',
            'status' => new OrderItemStatusResource($this->orderItemStatus),
        ];
    }
}
