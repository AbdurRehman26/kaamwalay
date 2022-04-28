<?php

namespace App\Http\Resources\API\V2\Customer\Order;

use App\Http\Resources\API\V1\Customer\Order\OrderCreateResource as V1OrderCreateResource;
use App\Http\Resources\API\V2\Admin\Order\OrderPaymentPlan\OrderPaymentPlanResource;

/**
 * @property mixed $orderPaymentPlan
 */
class OrderCreateResource extends V1OrderCreateResource
{
    public function toArray($request): array
    {
        $array = parent::toArray($request);
        $array['order_step'] = $this->order_step;
        $array['payment_plan'] = new OrderPaymentPlanResource($this->orderPaymentPlan);

        return $array;
    }
}
