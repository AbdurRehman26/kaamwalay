<?php

namespace App\Http\Resources\API\V1\Admin\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\Customer\User\UserResource;
use Illuminate\Http\Request;

class OrderStatusHistoryResource extends BaseResource
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
            'notes' => $this->notes,
            'order_id' => $this->order_id,
            'order_status_id' => $this->order_status_id,
            'order' => $this->whenLoaded('order', OrderResource::class),
            'order_status' => $this->whenLoaded('orderStatus', OrderStatusResource::class),
            'user' => $this->whenLoaded('user', UserResource::class),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }
}
