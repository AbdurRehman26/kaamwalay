<?php

namespace App\Http\Resources\API\V2\Customer\Wallet;

use App\Enums\Wallet\WalletTransactionReason;
use App\Http\Resources\API\BaseResource;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;

/**
 * @mixin WalletTransaction
*/
class WalletTransactionResource extends BaseResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->getTransactionDescription(),
            'amount' => $this->amount,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }

    protected function getTransactionDescription(): string
    {
        /** @var WalletTransactionReason */
        $reason = $this->reason;

        return match ($reason) {
            WalletTransactionReason::REFUND => $this->user->getFullName() . ' refund to customer\'s wallet',
            WalletTransactionReason::ORDER_PAYMENT => 'Customer used credit on a submission',
            WalletTransactionReason::WALLET_CREDIT => $this->user->getFullName() . ' credit to customer\'s wallet',
            WalletTransactionReason::WALLET_DEBIT => $this->user->getFullName() . ' debited from customer\'s wallet',
            WalletTransactionReason::WALLET_PAYMENT => 'Customer added to to wallet',
        };
    }
}