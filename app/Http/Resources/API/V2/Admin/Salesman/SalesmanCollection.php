<?php

namespace App\Http\Resources\API\V2\Admin\Salesman;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class SalesmanCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
