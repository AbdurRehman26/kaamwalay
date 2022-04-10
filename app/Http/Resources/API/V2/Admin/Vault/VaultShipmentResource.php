<?php

namespace App\Http\Resources\API\V2\Admin\Vault;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\Order\OrderCustomerResource;
use App\Http\Resources\API\V2\Customer\Order\OrderAddressResource;

class VaultShipmentResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'shipment_number' => $this->shipment_number,
            'created_at' => $this->formatDate($this->created_at),
            'shipped_at' => $this->formatDate($this->shipped_at),
            'customer' => $this->whenLoaded('user', OrderCustomerResource::class),
            'status' => $this->whenLoaded('vaultShipmentStatus', VaultShipmentStatusResource::class),
            'billing_address' => $this->whenLoaded('billingAddress', OrderAddressResource::class),
            'shipping_address' => $this->whenLoaded('shippingAddress', OrderAddressResource::class),
            'shipment_item' => $this->whenLoaded('vaultShipmentItems', VaultShipmentItemCollection::class),
            'cards_number' => $this->vaultShipmentItems()->count(),
            'tracking_number' => $this->tracking_number,
            'tracking_url' => $this->tracking_url,
        ];
    }
}
