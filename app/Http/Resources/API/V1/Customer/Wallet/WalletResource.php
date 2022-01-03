<?php

namespace App\Http\Resources\API\V1\Customer\Wallet;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class WalletResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     */
    public function toArray($request): array
    {
        return [
            'balance' => $this->balance
        ];
    }
}
