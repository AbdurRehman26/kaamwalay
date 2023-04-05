<?php

namespace App\Http\Resources\API\V2\Customer\Wallet;

use App\Http\Resources\API\V1\Customer\Wallet\WalletResource as V2WalletResource;
use App\Models\Wallet;
use Illuminate\Http\Request;

/** @mixin Wallet */
class WalletResource extends V2WalletResource
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
