<?php

namespace App\Http\Resources\API\V2\Admin\VaultShipment;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;

/**
 * @property mixed $id
 * @property mixed $code
 * @property mixed $name
 * @property mixed $description
 */
class VaultShipmentStatusResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
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
