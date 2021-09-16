<?php

namespace App\Http\Resources\API\Admin\Order\OrderItem;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemStatusHistoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_item_status' => $this->orderItemStatus,
            'notes' => $this->notes,
        ];
    }
}
