<?php

namespace App\Http\Resources\API\V2\Salesman\Customer;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Admin\Salesman\SalesmanResource;
use App\Http\Resources\API\V2\Customer\User\UserResource;
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->getFullName(),
            'customer_number' => $this->customer_number,
            'email' => $this->email,
            'phone' => $this->phone,
            'submissions' => $this->orders()->paid()->count(),
            'cards_count' => $this->cardsCount(),
            'wallet' => $this->wallet,
            'created_by' => new UserResource($this->createdBy),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
            'last_login_at' => $this->formatDate($this->last_login_at),
            'salesman' => new SalesmanResource($this->salesman),
        ];
    }
}
