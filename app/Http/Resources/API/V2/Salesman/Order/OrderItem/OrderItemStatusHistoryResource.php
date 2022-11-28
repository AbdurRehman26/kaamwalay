<?php

namespace App\Http\Resources\API\V2\Salesman\Order\OrderItem;

use App\Http\Resources\API\V2\Salesman\Order\OrderItem\OrderItemStatusResource;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemStatusHistoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_item_status' => new OrderItemStatusResource($this->orderItemStatus),
            'notes' => $this->notes,
        ];
    }
}
