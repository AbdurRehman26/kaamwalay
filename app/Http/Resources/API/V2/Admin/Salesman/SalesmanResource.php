<?php

namespace App\Http\Resources\API\V2\Admin\Salesman;

use App\Http\Resources\API\BaseResource;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * @mixin User
 */
class SalesmanResource extends BaseResource
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
            'email' => $this->email,
            'commission_type' => $this->salesmanProfile?->commission_type,
            'commission_value' => $this->salesmanProfile?->commission_value,
            'status' => $this->salesmanProfile?->is_active,
//            TODO
            'commission_earned' => 0,
            'orders' => 0,
            'customers' => 0,
            'sales' => 0,
        ];
    }
}
