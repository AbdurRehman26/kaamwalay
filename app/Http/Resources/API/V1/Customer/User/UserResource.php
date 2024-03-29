<?php

namespace App\Http\Resources\API\V1\Customer\User;

use App\Http\Resources\API\V1\Customer\Role\RoleCollection;
use App\Http\Resources\API\V1\Customer\Wallet\WalletResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_number' => $this->customer_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'username' => $this->username,
            'profile_image' => $this->profile_image,
            'phone' => $this->phone,
            'stripe_id' => $this->stripe_id,
            'roles' => new RoleCollection($this->roles),
            'wallet' => new WalletResource($this->wallet),
        ];
    }
}
