<?php

namespace App\Http\Resources\API\V2\Salesman;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use JsonSerializable;

class SalesmanCommissionPaymentCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int, SalesmanCommissionPaymentResource>|Arrayable<int, SalesmanCommissionPaymentResource>|JsonSerializable
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
