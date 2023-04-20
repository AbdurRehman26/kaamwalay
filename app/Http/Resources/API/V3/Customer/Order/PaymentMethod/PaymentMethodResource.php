<?php

namespace App\Http\Resources\API\V3\Customer\Order\PaymentMethod;

use App\Http\Resources\API\BaseResource;
use App\Models\PaymentMethod;

/** @mixin PaymentMethod */
class PaymentMethodResource extends BaseResource
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
