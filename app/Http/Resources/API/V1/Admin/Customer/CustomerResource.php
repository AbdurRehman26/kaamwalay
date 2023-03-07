<?php

namespace App\Http\Resources\API\V1\Admin\Customer;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

/**
 * @method orders()
 * @method cardsCount()
 */
class CustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'profile_image' => $this->profile_image,
            'full_name' => $this->getFullName(),
            'customer_number' => $this->customer_number,
            'email' => $this->email,
            'phone' => $this->phone,
            'submissions' => $this->orders()->paid()->count(),
            'cards_count' => $this->cardsCount(),
            'wallet' => $this->wallet,
            'created_at' => $this->formatDate($this->created_at),
            'update_at' => $this->formatDate($this->update_at),
        ];
    }
}
