<?php

namespace App\Http\Resources\API\V2\Admin\Salesman;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Customer\User\UserResource;
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
            'created_by' => new UserResource($this->createdBy),
            'commission_type' => $this->salesmanProfile->commission_type,
            'commission_value' => $this->salesmanProfile->commission_value,
            'status' => $this->salesmanProfile->is_active,
            'commission_earned' => $this->salesmanProfile->earnedCommission(),
            'sales' => $this->salesmanOrders()->sum('grand_total'),
            'customers' => $this->salesmanCustomersCount(),
            'orders' => $this->salesmanOrders()->count(),
        ];
    }
}
