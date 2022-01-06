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
        dump($this->reason);
        return [
            'id' => $this->id,
            'description' => $this->getTransactionDescription($this->reason, $this->user),
            'amount' => $this->amount,
            'created_at' => $this->created_at->toISOString(),
        ];
    }

    private function getTransactionDescription(string $reason, User $user): string
    {
        return match ($reason) {
            WalletTransaction::REASON_REFUND => $user->getFullName() . ' refund to customer\'s wallet',
            WalletTransaction::REASON_ORDER_PAYMENT => 'Customer used credit on a submission',
            WalletTransaction::REASON_WALLET_CREDIT => $user->getFullName() . ' credit to customer\'s wallet',
            default => 'Customer added to to wallet',
        };
    }
}
