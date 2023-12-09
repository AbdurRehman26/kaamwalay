<?php

namespace App\Http\Resources\API\V3\Admin\Order;

use App\Http\Resources\API\V2\Admin\Order\OrderCreateResource as V2OrderCreateResource;
use App\Models\Order;

/** @mixin Order */
class OrderCreateResource extends V2OrderCreateResource
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function toArray($request): array
    {
        $data = parent::toArray($request);

        return array_merge($data, [
            'shipping_insurance_fee' => $this->shipping_insurance_fee,
            'requires_shipping_insurance' => $this->requires_shipping_insurance,
            'signature_fee' => $this->signature_fee,
            'requires_signature' => $this->requires_signature,
        ]);
    }
}
