<?php

namespace App\Http\Resources\API\V3\Admin\Order\OrderItem;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\User\UserResource;
use App\Models\OrderItemStatusHistory;

/**
 * @mixin OrderItemStatusHistory
 */
class OrderItemStatusHistoryResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_item_status' => $this->whenLoaded('orderItemStatus', OrderItemStatusResource::class),
            'user' => $this->whenLoaded('user', UserResource::class),
            'notes' => $this->notes,
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }
}
