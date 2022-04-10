<?php

namespace App\Http\Resources\API\V2\Admin\Vault;

use App\Filament\Resources\UserCardResource;
use App\Http\Resources\API\BaseResource;

class VaultShipmentItemResource extends BaseResource
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
            'user_card' => $this->whenLoaded('vaultShipmentItems', UserCardResource::class),
        ];
    }
}
