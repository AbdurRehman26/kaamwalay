<?php

namespace App\Http\Resources\API\V1\Customer\UserCard;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\CardProduct\CardProductResource;
use Illuminate\Http\Request;

class UserCardListResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'card_product' => new CardProductResource($this->orderItem->cardProduct),
            'certificate_number' => $this->certificate_number,
            'overall_grade' => $this->resource->overall_grade,
        ];
    }
}
