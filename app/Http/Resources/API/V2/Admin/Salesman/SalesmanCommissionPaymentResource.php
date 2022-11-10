<?php

namespace App\Http\Resources\API\V2\Admin\Salesman;

use App\Http\Resources\API\BaseResource;

class SalesmanCommissionPaymentResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
