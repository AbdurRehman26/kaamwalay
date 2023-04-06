<?php

namespace App\Http\Resources\API\V3\Admin\Order\OrderItem;

use App\Http\Resources\API\V3\Admin\User\UserResource;
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
            'order_item_status' => $this->whenLoaded('orderItemStatus', new OrderItemStatusResource($this->orderItemStatus)),
            'user' => $this->whenLoaded('user', new UserResource($this->user)),
            'notes' => $this->notes,
            'updated_at' => $this->updated_at,
        ];
    }
}
