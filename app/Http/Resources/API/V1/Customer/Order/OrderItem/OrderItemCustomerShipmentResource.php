<?php

namespace App\Http\Resources\API\V1\Customer\Order\OrderItem;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemCustomerShipmentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'shipment_date' => $this->shipment_date,
            'tracking_number' => $this->tracking_number,
            'shipping_provider' => $this->shipping_provider,
        ];
    }
}
