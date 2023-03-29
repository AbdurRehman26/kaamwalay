<?php

namespace App\Http\Resources\API\V3\Admin\Order\OrderItem;

use App\Http\Resources\API\V3\Admin\Order\OrderItem\OrderItemStatusResource;
use App\Models\OrderItemStatusHistory;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin OrderItemStatusHistory
 */
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

