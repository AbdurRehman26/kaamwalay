<?php

namespace App\Http\Resources\API\V1\Admin\Coupon\Couponable;

use App\Http\Resources\API\BaseResource;

class CustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->getFullName(),
            'email' => $this->email,
        ];
    }
}
