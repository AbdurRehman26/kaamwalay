<?php

namespace App\Http\Resources\API\Admin\Order\OrderItem;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\CardProduct\CardProductResource;
use App\Http\Resources\API\Customer\UserCard\UserCardResource;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;

class OrderItemResource extends BaseResource
{
    public function toArray($request): array
    {
        $isGraded = $this->resource->order_item_status_id >= OrderItemStatus::GRADED;

        return [
            'id' => $this->resource->id,
            'order_id' => $this->resource->order_id,
            'quantity' => $this->resource->quantity,
            'declared_value_per_unit' => $this->resource->declared_value_per_unit,
            'card_product' => new CardProductResource($this->resource->cardProduct),
            'status' => new OrderItemStatusHistoryResource($this->resource->orderItemStatusHistory()->latest()->first()),
            
            // TODO: move certificate number inside the right relationship.
            'certificate_number' => $this->resource->userCard?->certificate_number,
            'user_card' => $this->whenLoaded('userCard', UserCardResource::class),
            'graded_by' => $this->when($isGraded, fn () => $this->getGradedStatusHistory()?->user?->getFullName()),
            'graded_at' => $this->when($isGraded, fn () => $this->formatDate($this->getGradedStatusHistory()?->updated_at)),
        ];
    }

    private function getGradedStatusHistory(): ?OrderItemStatusHistory
    {
        return $this->resource->orderItemStatusHistory()->where('order_item_status_id', OrderItemStatus::GRADED)->latest()->first();
    }
}
