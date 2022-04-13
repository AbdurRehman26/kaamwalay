<?php

namespace App\Http\Resources\API\V2\Admin\VaultShipment;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\Order\OrderCustomerResource;
use App\Http\Resources\API\V2\Customer\Order\OrderAddressResource;
use App\Http\Resources\API\V2\Customer\Order\ShippingMethod\ShippingMethodResource;

/**
 * @property mixed $id
 * @property mixed $shipment_number
 * @property mixed $created_at
 * @property mixed $shipped_at
 * @property mixed $tracking_number
 * @property mixed $shipping_provider
 * @property mixed $tracking_url
 * @method vaultShipmentItems()
 */
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
            'vault_shipment_item' => $this->whenLoaded('vaultShipmentItems', VaultShipmentItemCollection::class),
            'shipping_method' => $this->whenLoaded('shippingMethod', ShippingMethodResource::class),
            'cards_number' => $this->vaultShipmentItems()->count(),
            'tracking_number' => $this->tracking_number,
            'shipping_provider' => $this->shipping_provider,
            'tracking_url' => $this->tracking_url,
        ];
    }
}
