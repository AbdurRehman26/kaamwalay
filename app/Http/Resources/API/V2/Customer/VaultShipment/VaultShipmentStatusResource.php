<?php

namespace App\Http\Resources\API\V2\Customer\VaultShipment;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;
use App\Models\VaultShipmentStatus;

/** @mixin VaultShipmentStatus */
class VaultShipmentStatusResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
