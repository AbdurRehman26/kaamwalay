<?php

namespace App\Http\Resources\API\V2\Admin\Salesman;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Http\Request;
use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

class SalesmanCommissionPaymentCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  Request  $request
     * @return array<int, SalesmanCommissionPaymentResource>|Arrayable<int, SalesmanCommissionPaymentResource>|JsonSerializable
     */
    public function toArray($request)
    {
        return parent::toArray($request);
    }
}
