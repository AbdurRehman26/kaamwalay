<?php

namespace App\Http\Resources\API\V1\Customer\Order;

use App\Http\Resources\API\V1\Country\CountryResource;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property string $address_2
 */
class OrderAddressResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
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
