<?php

namespace App\Http\Resources\API\V2\Admin\VaultShipment;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\Admin\UserCard\UserCardResource;

/**
 * @property mixed $userCard
 */
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
            'user_card' => new UserCardResource($this->userCard),
        ];
    }
}
