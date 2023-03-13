<?php

namespace App\Http\Resources\API\V1\Customer\Wallet;

use App\Http\Resources\API\BaseResource;
use Illuminate\Http\Request;

class WalletResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'balance' => $this->balance,
        ];
    }
}
