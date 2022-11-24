<?php

namespace App\Http\Resources\API\V2\Salesman\Order\PaymentMethod;

use App\Models\PaymentMethod;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin PaymentMethod
*/
class PaymentMethodResource extends JsonResource
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
