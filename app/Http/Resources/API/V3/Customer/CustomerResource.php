<?php

namespace App\Http\Resources\API\V3\Customer;

use App\Http\Resources\API\BaseResource;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @mixin User
 */
class CustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => maskEmail($this->email),
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'customer_number' => $this->customer_number,
            'profile_image' => $this->profile_image,
        ];
    }
}
