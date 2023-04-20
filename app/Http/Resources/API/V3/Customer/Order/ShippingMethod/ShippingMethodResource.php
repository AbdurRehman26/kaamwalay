<?php

namespace App\Http\Resources\API\V3\Customer\Order\ShippingMethod;

use App\Models\ShippingMethod;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ShippingMethod */
class ShippingMethodResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
        ];
    }
}
