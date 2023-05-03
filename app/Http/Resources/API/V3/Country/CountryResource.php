<?php

namespace App\Http\Resources\API\V3\Country;

use App\Http\Resources\API\BaseResource;
use App\Models\Country;
use Illuminate\Http\Request;

/**
 * @mixin Country
 */
class CountryResource extends BaseResource
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
            'phone_code' => $this->phone_code,
        ];
    }
}
