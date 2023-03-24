<?php

namespace App\Http\Resources\API\V2\Admin\Wallet;

use App\Enums\Wallet\WalletTransactionReason;
use App\Models\WalletTransaction;
use App\Http\Resources\API\V1\Admin\Wallet\WalletTransactionResource as WalletTransactionResourceV2;

/**
 * @mixin WalletTransaction
*/
class WalletTransactionResource extends WalletTransactionResourceV2
{
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
