<?php

namespace App\Http\Resources\API\V1\Admin\Customer;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class CustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        return [
            'profile_image' => $this->profile_image,
            'full_name' => $this->getFullName(),
            'customer_number' => $this->customer_number,
            'email' => $this->email,
            'phone' => $this->phone,
            'created_at' => $this->formatDate($this->created_at),
            'submissions' => $this->orders()->placed()->count(),
        ];
    }
}
