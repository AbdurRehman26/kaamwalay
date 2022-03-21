<?php

namespace App\Http\Resources\API\V2\Customer\Role;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property int $id
 * @property string $name
 */
class RoleResource extends JsonResource
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
            'name' => $this->name,
        ];
    }
}
