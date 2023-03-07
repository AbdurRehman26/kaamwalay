<?php

namespace App\Http\Resources\API\V2\Customer\User;

use Illuminate\Http\Request;
use App\Http\Resources\API\V2\Customer\Role\RoleCollection;
use App\Http\Resources\API\V2\Customer\Wallet\WalletResource;
use App\Models\User;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
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
            'customer_number' => $this->customer_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->getFullName(),
            'email' => $this->email,
            'username' => $this->username,
            'profile_image' => $this->profile_image,
            'phone' => $this->phone,
            'stripe_id' => $this->stripe_id,
            'roles' => new RoleCollection($this->roles),
            'wallet' => new WalletResource($this->wallet),
            'is_marketing_notifications_enabled' => $this->is_marketing_notifications_enabled,
        ];
    }
}
