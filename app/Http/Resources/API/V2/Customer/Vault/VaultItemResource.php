<?php

namespace App\Http\Resources\API\V2\Customer\Vault;

use App\Http\Resources\API\BaseResource;

class VaultItemResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
