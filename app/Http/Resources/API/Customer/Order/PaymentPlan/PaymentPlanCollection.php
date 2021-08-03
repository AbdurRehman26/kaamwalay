<?php

namespace App\Http\Resources\API\Customer\Order\PaymentPlan;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PaymentPlanCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
