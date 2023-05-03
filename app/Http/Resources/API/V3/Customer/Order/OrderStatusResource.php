<?php

namespace App\Http\Resources\API\V3\Customer\Order;

use App\Http\Resources\API\BaseResource;
use App\Models\OrderStatus;
use Illuminate\Http\Request;

/** @mixin OrderStatus */
class OrderStatusResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }
}
