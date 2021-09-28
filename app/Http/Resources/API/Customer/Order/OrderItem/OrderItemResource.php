<?php

namespace App\Http\Resources\API\Customer\Order\OrderItem;

use App\Http\Resources\API\CardProduct\CardProductResource;
use App\Http\Resources\API\Customer\UserCard\UserCardResource;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->resource->id,
            'quantity' => $this->resource->quantity,
            'order_id' => $this->resource->order_id,
            'declared_value_per_unit' => $this->resource->declared_value_per_unit,
            // TODO: move certificate number inside the right relationship.
            'certificate_number' => $this->resource->userCard?->certificate_number,
            'card_product' => new CardProductResource($this->resource->cardProduct),
            'status' => new OrderItemStatusResource($this->resource->orderItemStatus),
            'user_card' => $this->whenLoaded('userCard', UserCardResource::class),
        ];
    }
}
