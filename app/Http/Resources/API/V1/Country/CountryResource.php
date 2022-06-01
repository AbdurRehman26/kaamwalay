<?php

namespace App\Http\Resources\API\V1\Country;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property string $phone_code
 */
class CountryResource extends JsonResource
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
            'phone_code' => $this->phone_code,
        ];
    }
}
