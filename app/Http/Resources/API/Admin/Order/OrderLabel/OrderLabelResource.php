<?php

namespace App\Http\Resources\API\Admin\Order\OrderLabel;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderLabelResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'path' => $this->path,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
