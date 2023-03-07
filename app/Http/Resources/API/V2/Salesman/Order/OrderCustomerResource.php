<?php

namespace App\Http\Resources\API\V2\Salesman\Order;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Customer\Wallet\WalletResource;
use App\Models\User;

/** @mixin User */
class OrderCustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_number' => $this->customer_number,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'wallet' => $this->whenLoaded('wallet', WalletResource::class),
        ];
    }
}
