<?php

namespace App\Http\Resources\API\V2\Admin\Order\OrderPaymentPlan;

use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderPaymentPlanCollection extends ResourceCollection
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
