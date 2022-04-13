<?php

namespace App\Http\Resources\API\V2\Customer\VaultShipment;

use App\Http\Resources\API\BaseResource;
use App\Models\VaultShipmentStatus;

/** @mixin VaultShipmentStatus */
class VaultShipmentStatusResource extends BaseResource
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
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
        ];
    }
}
