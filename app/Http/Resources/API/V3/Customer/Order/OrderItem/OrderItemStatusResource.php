<?php

namespace App\Http\Resources\API\V3\Customer\Order\OrderItem;

use App\Http\Resources\API\BaseResource;
use App\Models\OrderItemStatus;

/** @mixin OrderItemStatus */
class OrderItemStatusResource extends BaseResource
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
