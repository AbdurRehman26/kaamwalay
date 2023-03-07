<?php

namespace App\Http\Resources\API\V2\Customer\VaultShipment;

use App\Http\Resources\API\BaseResource;
use App\Models\VaultShipment;
use Illuminate\Http\Request;

/** @mixin VaultShipment */
class VaultShipmentResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'shipment_number' => $this->shipment_number,
            'created_at' => $this->formatDate($this->created_at),
            'shipped_at' => $this->formatDate($this->shipped_at),
            'cards_number' => $this->vaultShipmentItems()->count(),
            'tracking_number' => $this->tracking_number,
            'tracking_url' => $this->tracking_url,
            'vault_shipment_status' => $this->whenLoaded('vaultShipmentStatus', VaultShipmentStatusResource::class),
        ];
    }
}
