<?php

namespace App\Http\Resources\API\V1\Admin\Wallet;

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
