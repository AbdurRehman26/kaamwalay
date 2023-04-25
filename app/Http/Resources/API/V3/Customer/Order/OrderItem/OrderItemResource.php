<?php

namespace App\Http\Resources\API\V3\Customer\Order\OrderItem;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Customer\CardProduct\CardProductResource;
use App\Http\Resources\API\V3\Customer\Order\UserCard\UserCardResource;
use App\Models\OrderItem;
use App\Models\OrderStatus;

/** @mixin OrderItem */
class OrderItemResource extends BaseResource
{
    protected OrderStatus $orderStatus;

    public function orderStatus(OrderStatus $value): OrderItemResource
    {
        $this->orderStatus = $value;

        return $this;
    }

    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'order_id' => $this->order_id,
            'declared_value_per_unit' => $this->declared_value_per_unit,
            'card_product' => $this->whenLoaded('cardProduct', CardProductResource::class),
            'status' => $this->whenLoaded('orderItemStatus', OrderItemStatusResource::class),
            'user_card' => $this->whenLoaded('userCard', UserCardResource::make($this->userCard)->orderStatus($this->orderStatus)),
            'notes' => $this->notes ?? '',
        ];
    }

    public static function collection($resource)
    {
        // @phpstan-ignore-next-line
        return new OrderItemCollection($resource);
    }
}
