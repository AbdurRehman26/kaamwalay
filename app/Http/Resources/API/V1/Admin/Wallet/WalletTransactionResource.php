<?php

namespace App\Http\Resources\API\V1\Admin\Wallet;

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
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
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
        return match ($this->getAttributeValue('reason')) {
            WalletTransactionReason::REFUND->value => $this->user->getFullName() . ' refund to customer\'s wallet',
            WalletTransactionReason::ORDER_PAYMENT->value => 'Customer used credit on a submission',
            WalletTransactionReason::WALLET_CREDIT->value => $this->user->getFullName() . ' credit to customer\'s wallet',
            default => 'Customer added to to wallet',
        };
    }
}
