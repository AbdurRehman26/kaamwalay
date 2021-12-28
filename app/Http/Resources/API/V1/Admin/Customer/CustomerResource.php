<?php

namespace App\Http\Resources\API\Admin\Customer;

use App\Http\Resources\API\BaseResource;
use Carbon\Carbon;
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
            'signed_up' => Carbon::parse($this->created_at)->toDateString(),
            'submissions' => $this->orders_count,
        ];
    }
}
