<?php

namespace App\Http\Resources\API\Customer\Order\OrderLabel;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderLabelResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'path' => $this->path,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
