<?php

namespace App\Http\Resources\API\V2\Salesman\Wallet;

use Illuminate\Http\Request;
use App\Http\Resources\API\BaseResource;
use App\Models\Wallet;

/**
 * @mixin Wallet
*/
class WalletResource extends BaseResource
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
            'name' => $this->user->getFullName(),
            'balance' => $this->balance,
        ];
    }
}
