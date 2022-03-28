<?php

namespace App\Http\Resources\API\V2\Customer\Vault;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Customer\Order\OrderResource;
use App\Http\Resources\API\V2\Customer\UserCard\UserCardResource;
use App\Models\VaultItem;

/** @mixin VaultItem */
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
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user_card' => new UserCardResource($this->whenLoaded('userCard')),
            'order' => new OrderResource($this->whenLoaded('order')),
            'status' => $this->status,
        ];
    }
}
