<?php

namespace App\Http\Resources\API\Admin\Order;

use App\Http\Resources\API\BaseResource;

class OrderShipmentResource extends BaseResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'shipment_date' => $this->shipment_date,
            'shipping_provider' => $this->shipping_provider,
            'tracking_number' => $this->tracking_number,
            'tracking_url' => $this->tracking_url,
        ];
    }
}
