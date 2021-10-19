<?php

namespace App\Http\Resources\API\Admin\Order;

use App\Http\Resources\API\Admin\Order\OrderItem\OrderItemResource;
use App\Http\Resources\API\BaseResource;
use App\Models\Order;

class UserCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        /** @var Order $order */
        $order = $this?->orderItem?->order;

        return [
            'id' => $this->id,
            'customer' => new OrderCustomerResource($this->user),
            'order_item' => new OrderItemResource($this->orderItem),
            'human_grade_values' => $this->human_grade_values,
            'robo_grade_values' => $this->robo_grade_values,
            'overall_values' => $this->getRoundedOverallValues(),
            'grade' => [
                'grade' => $this->resource->overall_grade,
                'nickname' => $this->overall_grade_nickname,
            ],
            'grading_id' => $this->grading_id,
            'ai_model_numbers' => $this->ai_model_numbers,
            'generated_images' => $this->generated_images,
            'updated_at' => $this->formatDate($this->updated_at),
            'order' => [
                'auto_saved_at' => $this->formatDate($order?->auto_saved_at),
                'total_graded_items' => $order?->getTotalGradedItems(),
            ],
        ];
    }
}
