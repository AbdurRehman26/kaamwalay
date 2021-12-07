<?php

namespace App\Http\Resources\API\Customer\User;

use App\Http\Resources\API\Customer\Role\RoleCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'customer_number' => $this->customer_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'username' => $this->username,
            'email_subscription' => $this->email_subscription,
            'phone' => $this->phone,
            'stripe_id' => $this->stripe_id,
            'roles' => new RoleCollection($this->roles),
        ];
    }
}
