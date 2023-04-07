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
        $orderItemStatusResource = null;
        $userResource = null;

        if ($this->resource->relationLoaded('orderItemStatus')){
            $orderItemStatusResource =new OrderItemStatusResource($this->orderItemStatus);
        }

        if ($this->resource->relationLoaded('user')){
            $userResource = new UserResource($this->user);
        }

        return [
            'id' => $this->id,
            'order_item_status' => $this->whenLoaded('orderItemStatus', $orderItemStatusResource),
            'user' => $this->whenLoaded('user', $userResource),
            'notes' => $this->notes,
            'updated_at' => $this->updated_at,
        ];
    }
}
