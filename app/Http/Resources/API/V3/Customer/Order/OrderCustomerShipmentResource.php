<?php

namespace App\Http\Resources\API\V3\Customer\Order;

use App\Http\Resources\API\BaseResource;
use App\Models\OrderCustomerShipment;

/** @mixin OrderCustomerShipment */
class OrderCustomerShipmentResource extends BaseResource
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
