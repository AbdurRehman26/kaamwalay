<?php

namespace App\Http\Resources\API\V3\Admin\Order\PaymentPlanRange;

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
