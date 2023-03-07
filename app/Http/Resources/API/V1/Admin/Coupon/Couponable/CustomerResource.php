<?php

namespace App\Http\Resources\API\V1\Admin\Coupon\Couponable;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;

class CustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->getFullName(),
            'email' => $this->email,
        ];
    }
}
