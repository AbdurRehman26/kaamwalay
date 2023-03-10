<?php

namespace App\Http\Resources\API\V2\Admin\VaultShipment;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\Admin\UserCard\UserCardResource;
use Illuminate\Http\Request;

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
