<?php

namespace App\Http\Resources\API\V2\Salesman\Order\OrderItem;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemStatusResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
