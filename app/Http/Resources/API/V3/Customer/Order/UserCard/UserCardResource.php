<?php

namespace App\Http\Resources\API\V3\Customer\Order\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Models\OrderStatus;
use App\Models\UserCard;
use Illuminate\Http\Request;

/** @mixin UserCard */
class UserCardResource extends BaseResource
{
    protected OrderStatus $orderStatus;

    public function orderStatus(OrderStatus $value): UserCardResource
    {
        $this->orderStatus = $value;
        return $this;
    }
    /**
     * Transform the resource into an array.
     */

    public function toArray(Request $request): array
    {
        $isShipped = $this->orderStatus->id >= OrderStatus::SHIPPED;

        return [
            'id' => $this->id,
            'certificate_number' => $this->certificate_number,
            'overall_values' => $this->overall_values,
            'human_grade_values' => $this->human_grade_values,
            'generated_images' => $this->generated_images,
            'overall_grade' => $this->when($isShipped, $this->resource->overall_grade),
            'overall_grade_nickname' => $this->when($isShipped, $this->resource->overall_grade_nickname),
        ];
    }
}
