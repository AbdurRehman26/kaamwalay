<?php

namespace App\Http\Resources\API\V2\Customer\Address\State;

use Illuminate\Http\Request;
use App\Http\Resources\API\V1\Country\CountryResource;
use App\Models\State;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin State
 */
class StateResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'country' => new CountryResource($this->country),
        ];
    }
}
