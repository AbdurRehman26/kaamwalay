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
        $isGraded = $this->order_item_status_id >= OrderItemStatus::GRADED;

        $latestStatusHistoryQuery = $this->orderItemStatusHistory()->latest();

        if ($isGraded) {
            $latestStatusHistoryQuery->with(['user']);
        }

        $latestStatusHistory = $latestStatusHistoryQuery->first();

        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'quantity' => $this->quantity,
            'declared_value_per_unit' => $this->declared_value_per_unit,
            'card_product' => $this->whenLoaded('cardProduct', new CardProductResource($this->cardProduct)),
            'status' => new OrderItemStatusHistoryResource($latestStatusHistory),
            'user_card' => $this->whenLoaded('userCard', UserCardResource::class),
            'graded_by' => $this->when($isGraded, fn () => $latestStatusHistory?->user?->getFullName()),
            'graded_at' => $this->when($isGraded, fn () => $this->formatDate($latestStatusHistory?->updated_at)),
            'notes' => $this->notes ?? '',
            'internal_notes' => $this->internal_notes ?? '',
        ];
    }
}
