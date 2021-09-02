<?php

namespace App\Http\Resources\API\Customer\Order\OrderItem;

use App\Http\Resources\API\Customer\Order\OrderItem\OrderItemStatusResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemStatusResource extends JsonResource
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
