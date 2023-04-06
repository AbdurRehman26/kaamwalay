<?php

namespace App\Http\Resources\API\V3\Admin\Order\OrderItem;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\CardProduct\CardProductResource;
use App\Http\Resources\API\V3\Admin\UserCard\UserCardResource;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;

/**
 * @mixin OrderItem
 */
class OrderItemResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'quantity' => $this->quantity,
            'declared_value_per_unit' => $this->declared_value_per_unit,
            'card_product' => $this->whenLoaded('cardProduct', CardProductResource::class),
            'status' => $this->whenLoaded('latestOrderItemStatusHistory', OrderItemStatusHistoryResource::class),
            'user_card' => $this->whenLoaded('userCard', UserCardResource::class),
            'notes' => $this->notes ?? '',
            'internal_notes' => $this->internal_notes ?? '',
        ];
    }
}
