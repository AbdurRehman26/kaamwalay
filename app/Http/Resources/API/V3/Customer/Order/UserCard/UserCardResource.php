<?php

namespace App\Http\Resources\API\V3\Customer\Order\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Models\OrderStatus;
use App\Models\UserCard;
use Illuminate\Http\Request;

/** @mixin UserCard */
class UserCardResource extends BaseResource
{
    protected static int $orderStatusId;

    public function toArray(Request $request): array
    {
        $isShipped = $this->getOrderStatusId() >= OrderStatus::SHIPPED;

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

    /*
     * When it loads multiple user cards for the same order, it will make one query to get order status
     * rather than making multiple queries for each user card
     */
    protected function getOrderStatusId(): int
    {
        if (! isset(self::$orderStatusId)) {
            return self::$orderStatusId = $this->orderItem->order->order_status_id;
        }

        return self::$orderStatusId;
    }
}
