<?php

namespace App\Http\Resources\API\V2\Admin\Order;

use App\Http\Resources\API\BaseResource;
use App\Http\Resources\API\V2\Customer\Wallet\WalletResource;
use App\Models\User;
use Illuminate\Http\Request;

/** @mixin User */
class OrderCustomerResource extends BaseResource
{
    /**
     * Transform the resource into an array.
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
