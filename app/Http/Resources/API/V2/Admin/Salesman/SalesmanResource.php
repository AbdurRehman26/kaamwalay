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
            'customers' => $this->totalCustomersCount,
            'orders' => $this->totalOrdersCount,
            'commission_earned' => $this->commissionEarned,
            'commission_paid' => $this->commissionPaid,
            'status' => $this->status,
            'sales' => $this->totalSales,
        ];
    }
}
