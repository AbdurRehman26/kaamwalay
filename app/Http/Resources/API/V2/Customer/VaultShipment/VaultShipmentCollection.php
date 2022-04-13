<?php

namespace App\Http\Resources\API\V2\Customer\VaultShipment;

use Illuminate\Http\Resources\Json\ResourceCollection;

class VaultShipmentCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
