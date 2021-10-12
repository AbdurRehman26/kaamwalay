<?php

namespace App\Http\Resources\API\Customer\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\CardProduct\CardProductResource;
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
            'id' => $this->orderItem->card_product_id,
            'card_product' => new CardProductResource($this->orderItem->cardProduct),
            'certificate_number' => $this->certificate_number,
            'submission_number' => $this->orderItem->order->order_number,
            'overall_values' => $this->overall_values,
            'human_grade_values' => $this->human_grade_values,
            'generated_images' => $this->generated_images,

            'overall_grade' => $this->resource->overall_grade,
            'overall_grade_nickname' => $this->resource->overall_grade_nickname,
        ];
    }
}
