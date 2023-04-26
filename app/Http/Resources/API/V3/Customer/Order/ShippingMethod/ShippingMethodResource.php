<?php

namespace App\Http\Resources\API\V3\Customer\Order\ShippingMethod;

use App\Http\Resources\API\BaseResource;
use App\Models\ShippingMethod;

/** @mixin ShippingMethod */
class ShippingMethodResource extends BaseResource
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
