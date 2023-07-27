<?php

namespace App\Http\Resources\API\V2\Customer\Address;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Country\CountryResource;
use App\Models\CustomerAddress;
use Illuminate\Http\Request;

/**
 * @mixin CustomerAddress
 */
class CustomerAddressResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'address' => $this->address,
            'address_2' => $this->address_2,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'phone' => $this->phone,
            'flat' => $this->flat,
            'country' => new CountryResource($this->country),
        ];
    }
}
