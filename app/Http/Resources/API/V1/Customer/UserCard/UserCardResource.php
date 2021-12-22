<?php

namespace App\Http\Resources\API\V1\Customer\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\CardProduct\CardProductResource;
use App\Http\Resources\API\V1\Customer\Order\OrderItem\OrderItemResource;
use Illuminate\Http\Request;

class UserCardResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'card_product' => new CardProductResource($this->orderItem->cardProduct),
            'certificate_number' => $this->certificate_number,
            'order_number' => $this->orderItem->order->order_number,
            'order_id' => $this->orderItem->order->id,
            'overall_values' => $this->overall_values,
            'human_grade_values' => $this->human_grade_values,
            'generated_images' => $this->generated_images,
            'overall_grade' => $this->resource->overall_grade,
            'overall_grade_nickname' => $this->resource->overall_grade_nickname,
            'order_item' => new OrderItemResource($this->orderItem),
            'submitted_at' => $this->formatDate($this->orderItem->order->created_at),
        ];
    }
}
