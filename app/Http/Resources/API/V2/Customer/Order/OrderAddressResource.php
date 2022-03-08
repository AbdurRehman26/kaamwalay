<?php

namespace App\Http\Resources\API\V2\Customer\Order;

use App\Http\Resources\API\V2\Country\CountryResource;
use App\Models\OrderAddress;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin OrderAddress */
class OrderAddressResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'phone' => $this->phone,
            'flat' => $this->flat,
            'country' => new CountryResource($this->country),
        ];
    }
}
