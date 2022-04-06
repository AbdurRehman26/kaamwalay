<?php

namespace App\Http\Resources\API\V2\Customer\VaultShipment;

use App\Http\Resources\API\BaseResource;
use App\Models\VaultShipment;

/** @mixin VaultShipment */
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
            'status' => new VaultShipmentStatusResource($this->vaultShipmentStatus),
            'cards_number' => $this->vaultShipmentItems()->count(),
            'tracking_number' => $this->tracking_number,
            'tracking_url' => $this->tracking_url,
        ];
    }
}
