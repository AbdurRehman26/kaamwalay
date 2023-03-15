<?php

namespace App\Http\Resources\API\V2\Admin\VaultShipment;

use App\Models\VaultShipment;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use JsonSerializable;

class VaultShipmentCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array|Arrayable<int, VaultShipment>|JsonSerializable
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
