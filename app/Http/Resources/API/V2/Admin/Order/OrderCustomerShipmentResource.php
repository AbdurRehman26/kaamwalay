<?php

namespace App\Http\Resources\API\V2\Admin\Order;

use App\Models\OrderCustomerShipment;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin OrderCustomerShipment */
class OrderCustomerShipmentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'shipment_date' => $this->shipment_date,
            'shipping_provider' => $this->shipping_provider,
            'tracking_number' => $this->tracking_number,
        ];
    }
}
