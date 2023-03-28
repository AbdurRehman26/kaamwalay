<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\Order\OrderItem\OrderItemResource;
use Illuminate\Http\Request;

class UserCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer' => $this->whenLoaded('customer', new OrderCustomerResource($this->user)),
            'order_item' => $this->whenLoaded('orderItem', OrderItemResource::class),
            'human_grade_values' => $this->human_grade_values,
            'robo_grade_values' => $this->robo_grade_values,
            'overall_values' => $this->getRoundedOverallValues(),
            'grade' => [
                'grade' => $this->resource->overall_grade,
                'nickname' => $this->overall_grade_nickname,
            ],
            'grade_delta' => $this->grade_delta,
            'grading_id' => $this->grading_id,
            'ai_model_numbers' => $this->ai_model_numbers,
            'generated_images' => $this->generated_images,
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }
}
