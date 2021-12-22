<?php

namespace App\Http\Resources\API\Customer\Order\OrderItem;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\CardProduct\CardProductResource;

class OrderItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'order_id' => $this->order_id,
            'declared_value_per_unit' => $this->declared_value_per_unit,
            // TODO: move certificate number inside the right relationship.
            'certificate_number' => $this->userCard?->certificate_number,
            'notes' => $this->notes ?? '',
            'card_product' => new CardProductResource($this->cardProduct),
            'status' => new OrderItemStatusResource($this->orderItemStatus),
        ];
    }
}
