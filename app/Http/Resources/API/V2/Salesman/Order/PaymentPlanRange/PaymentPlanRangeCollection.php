<?php

namespace App\Http\Resources\API\V2\Salesman\Order\PaymentPlanRange;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PaymentPlanRangeCollection extends ResourceCollection
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
