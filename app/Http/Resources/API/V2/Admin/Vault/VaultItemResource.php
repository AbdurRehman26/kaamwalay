<?php

namespace App\Http\Resources\API\V2\Admin\Vault;

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
        return [
            'user_card' => $this->id, 
        ];
    }
}
