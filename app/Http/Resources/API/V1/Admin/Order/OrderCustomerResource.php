<?php

namespace App\Http\Resources\API\V1\Admin\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V1\Customer\Wallet\WalletResource;

class OrderCustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
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
