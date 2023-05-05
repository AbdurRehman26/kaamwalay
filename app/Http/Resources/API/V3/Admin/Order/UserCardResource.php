<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V3\Admin\Order\OrderItem\OrderItemResource;
use App\Models\UserCard;
use Illuminate\Http\Request;

/**
 * @mixin UserCard
 */
class UserCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'certificate_number' => $this->certificate_number,
            'customer' => $this->whenLoaded('customer', OrderCustomerResource::class),
            'human_grade_values' => $this->human_grade_values,
            'robo_grade_values' => $this->robo_grade_values,
            'overall_values' => $this->getRoundedOverallValues(),
            'overall_grade' => $this->overall_grade,
            'overall_grade_nickname' => $this->overall_grade_nickname,
            'grade_delta' => $this->grade_delta,
            'grading_id' => $this->grading_id,
            'ai_model_numbers' => $this->ai_model_numbers,
            'generated_images' => $this->generated_images,
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }
}
