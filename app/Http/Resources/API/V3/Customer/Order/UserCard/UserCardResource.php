<?php

namespace App\Http\Resources\API\V3\Customer\Order\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Models\OrderStatus;
use Illuminate\Http\Request;

class UserCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */

    public function toArray(Request $request): array
    {
        // @phpstan-ignore-next-line
        $isShipped = $this->orderItem->order->orderStatus->id >= OrderStatus::SHIPPED;

        return [
            'id' => $this->id,
            'certificate_number' => $this->certificate_number,
            'overall_values' => $this->overall_values,
            'human_grade_values' => $this->human_grade_values,
            'generated_images' => $this->generated_images,
            'overall_grade' => $this->when($isShipped, $this->resource->overall_grade),
            'overall_grade_nickname' => $this->resource->overall_grade_nickname,
        ];
    }
}
