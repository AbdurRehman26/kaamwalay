<?php

namespace App\Http\Resources\API\V2\Admin\Customer;

use App\Http\Resources\API\V1\Admin\Customer\CustomerResource as V1CustomerResource;
use Illuminate\Http\Request;

class CustomerResource extends V1CustomerResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
    {
        return parent::toArray($request);
    }
}
