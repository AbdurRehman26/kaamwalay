<?php

namespace App\Http\Resources\API\V1\Admin\Wallet;

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
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->user->getFullName(),
            'balance' => $this->balance,
        ];
    }
}
