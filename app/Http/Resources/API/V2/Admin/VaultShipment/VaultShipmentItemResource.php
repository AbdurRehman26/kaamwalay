<?php

namespace App\Http\Resources\API\V2\Admin\VaultShipment;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\Admin\UserCard\UserCardResource;

/**
 * @property mixed $userCard
 */
class VaultShipmentItemResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'user_card' => new UserCardResource($this->userCard),
        ];
    }
}
