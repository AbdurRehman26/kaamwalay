<?php

namespace App\Http\Resources\API\V2\Customer\Order;

use App\Http\Resources\API\V1\Customer\Order\OrderCreateResource as V1OrderCreateResource;
use App\Models\Order;

/** @mixin Order */
class OrderCreateResource extends V1OrderCreateResource
{
    public function toArray($request): array
    {
        $array = parent::toArray($request);
        $array['order_step'] = $this->order_step;
        $array['requires_cleaning'] = $this->requires_cleaning;
        $array['cleaning_fee'] = $this->cleaning_fee;

        return $array;
    }
}
