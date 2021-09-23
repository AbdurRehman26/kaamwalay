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
            'quantity' => $this->quantity,
            'declared_value_per_unit' => $this->declared_value_per_unit,
            'card_product' => new CardProductResource($this->cardProduct),
            'status' => new OrderItemStatusHistoryResource($this->orderItemStatusHistory()->latest()->first()),
            'certificate_number' => $this->userCard?->certificate_number,
            'grade' => [
                'grade' => $this?->userCard?->overall_grade,
                'nickname' => $this?->userCard?->overall_grade_nickname,
            ],

            'graded_by' => $this->when($this->order_item_status_id === OrderItemStatus::GRADED, $gradedHistory?->user?->getFullName()),
            'graded_at' => $this->when($this->order_item_status_id === OrderItemStatus::GRADED, $this->formatDate($gradedHistory?->updated_at)),
        ];
    }
}
