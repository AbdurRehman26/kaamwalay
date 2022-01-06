<?php

namespace App\Http\Resources\API\V1\Admin\Wallet;

use App\Http\Resources\API\BaseResource;
use App\Models\User;
use App\Models\WalletTransaction;

/**
 * @mixin WalletTransaction
*/
class WalletTransactionResource extends BaseResource
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
            'description' => $this->getTransactionDescription($this->user),
            'amount' => $this->amount,
            'created_at' => $this->created_at->toISOString(),
        ];
    }

    private function getTransactionDescription(User $user): string
    {
        if ($user->isAdmin() && ! $user->is($user?->wallet?->user)) {
            return $user->getFullName() . ' added to user\'s wallet';
        }

        return 'Customer added to wallet';
    }
}
