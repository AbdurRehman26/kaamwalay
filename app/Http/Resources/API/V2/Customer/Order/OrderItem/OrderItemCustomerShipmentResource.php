<?php

namespace App\Http\Resources\API\V2\Customer\Order\OrderItem;

use App\Models\OrderItemCustomerShipment;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin OrderItemCustomerShipment */
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
