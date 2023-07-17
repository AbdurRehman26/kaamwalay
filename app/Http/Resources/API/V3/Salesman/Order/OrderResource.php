<?php

namespace App\Http\Resources\API\V3\Salesman\Order;

use App\Http\Resources\API\V2\Salesman\Order\OrderResource as V2OrderResource;
use App\Models\Order;

/** @mixin Order */
class OrderResource extends V2OrderResource
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'shipping_insurance_fee' => $this->shipping_insurance_fee,
            'has_shipping_insurance' => $this->has_shipping_insurance,
        ]);
    }
}
