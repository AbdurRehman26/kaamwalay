<?php

namespace App\Http\Resources\API\Customer\Order\PaymentMethod;

use Illuminate\Http\Resources\Json\JsonResource;

class PaymentMethodResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->name,
            'name' => $this->name,
        ];
    }
}
