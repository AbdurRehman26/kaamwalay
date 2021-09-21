<?php

namespace App\Http\Resources\API\Admin\Order\OrderItem;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\CardProduct\CardProductResource;
use App\Models\OrderItemStatus;

class OrderItemResource extends BaseResource
{
    public function toArray($request): array
    {
        $gradedHistory = $this->orderItemStatusHistory()->where('order_item_status_id', OrderItemStatus::GRADED)->latest()->first();

        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'quantity' => $this->quantity,
            'declared_value_per_unit' => $this->declared_value_per_unit,
            'card_product' => new CardProductResource($this->cardProduct),
            'status' => new OrderItemStatusHistoryResource($this->orderItemStatusHistory()->latest()->first()),
            'certificate_number' => $this->userCard?->userCardCertificate?->number,

            'graded_by' => $this->when($this->order_item_status_id === OrderItemStatus::GRADED, $gradedHistory?->user?->getFullName()),
            'graded_at' => $this->when($this->order_item_status_id === OrderItemStatus::GRADED, $this->formatDate($gradedHistory?->updated_at)),
        ];
    }
}
