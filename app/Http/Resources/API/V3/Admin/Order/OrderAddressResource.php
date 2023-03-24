<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\V3\Shared\Country\CountryResource;
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
            'address_2' => $this->address_2,
            'city' => $this->city,
            'state' => $this->state,
            'zip' => $this->zip,
            'phone' => $this->phone,
            'flat' => $this->flat,
            'country_id' => $this->country_id,
//            'country' => $this->whenLoaded('country', CountryResource::class),
            'country' => $this->whenLoaded('country', new CountryResource($this->country)),
        ];
    }
}
