<?php

namespace App\Http\Resources\API\V2\Customer\Order\OrderItem;

use App\Models\OrderItemStatus;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin OrderItemStatus */
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
