<?php

namespace App\Http\Resources\API\V2\Admin\VaultShipment;

use App\Models\VaultShipment;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use JsonSerializable;
class VaultShipmentItemCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array|Arrayable<int, VaultShipment>|JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
