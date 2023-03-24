<?php

namespace App\Http\Resources\API\V3\Admin\Order\OrderItem;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\Order\OrderItem\OrderItemStatusHistoryResource;
use App\Http\Resources\API\V3\Admin\UserCard\UserCardResource;
use App\Http\Resources\API\V3\Admin\CardProduct\CardProductResource;
use App\Models\OrderItemStatus;
use App\Models\OrderItemStatusHistory;

class OrderItemResource extends BaseResource
{
    public function toArray($request): array
    {
        $isGraded = $this->order_item_status_id >= OrderItemStatus::GRADED;

        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'quantity' => $this->quantity,
            'declared_value_per_unit' => $this->declared_value_per_unit,
            'card_product' => new CardProductResource($this->cardProduct),
            'status' => new OrderItemStatusHistoryResource($this->orderItemStatusHistory()->latest()->first()),

            'certificate_number' => $this->userCard?->certificate_number,
            'user_card' => $this->whenLoaded('userCard', UserCardResource::class),
            'graded_by' => $this->when($isGraded, fn () => $this->getGradedStatusHistory()?->user?->getFullName()),
            'graded_at' => $this->when($isGraded, fn () => $this->formatDate($this->getGradedStatusHistory()?->updated_at)),
            'notes' => $this->notes ?? '',
            'internal_notes' => $this->internal_notes ?? '',
        ];
    }

    private function getGradedStatusHistory(): ?OrderItemStatusHistory
    {
        return $this->orderItemStatusHistory()->where('order_item_status_id', OrderItemStatus::GRADED)->latest()->first();
    }
}
