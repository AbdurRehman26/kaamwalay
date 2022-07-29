<?php

namespace App\Http\Resources\API\V2\Admin\Customer;

use App\Http\Resources\API\BaseResource;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @mixin User
 */
class CustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request): array
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
            'created_by' => $this->createdBy?->getFullName(),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
            'last_login_at' => $this->formatDate($this->last_login_at),
        ];
    }
}
