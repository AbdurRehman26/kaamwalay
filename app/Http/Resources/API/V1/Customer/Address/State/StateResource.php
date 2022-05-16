<?php

namespace App\Http\Resources\API\V1\Customer\Address\State;

use App\Http\Resources\API\V1\Country\CountryResource;
use Illuminate\Http\Resources\Json\JsonResource;

class StateResource extends JsonResource
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
            'code' => $this->code,
            'name' => $this->name,
            'country' => new CountryResource($this->country),
        ];
    }
}
