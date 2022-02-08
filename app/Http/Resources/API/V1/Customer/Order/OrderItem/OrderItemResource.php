<?php

namespace App\Http\Resources\API\V1\Customer\Order\OrderItem;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\CardProduct\CardProductResource;
use App\Http\Resources\API\V1\Customer\UserCard\UserCardResource;

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
            'card_product' => new CardProductResource($this->cardProduct),
            'status' => new OrderItemStatusResource($this->orderItemStatus),
            'user_card' => $this->whenLoaded('userCard', UserCardResource::class),
        ];
    }
}
