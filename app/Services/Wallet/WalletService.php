<?php

namespace App\Services\Wallet;

use App\Enums\Wallet\WalletTransactionReason;
use App\Enums\Wallet\WalletTransactionType;
use App\Exceptions\API\Wallet\InvalidWalletTransactionException;
use App\Models\Order;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class WalletService
{
    protected const TRANSACTIONS_PER_PAGE = 15;

    public function createWallet(array $attributes): void
    {
        $wallet = new Wallet($attributes);
        $wallet->save();
    }

    public function processTransaction(
        int $walletId,
        float $amount,
        WalletTransactionReason $reason,
        int $userId,
        ?int $orderId
    ): void {
        $wallet = Wallet::find($walletId);

        match ($reason) {
            WalletTransactionReason::REFUND => $this->processRefund($wallet, $amount, $userId, $orderId),
            WalletTransactionReason::ORDER_PAYMENT => $this->processOrderPayment($wallet, $amount, $orderId),
            WalletTransactionReason::WALLET_CREDIT => $this->processCustomerWalletCredit($wallet, $amount, $userId),
            WalletTransactionReason::WALLET_PAYMENT => $this->processWalletPayment($wallet, $amount),
        };
    }

    protected function processRefund(Wallet $wallet, float $amount, int $userId, ?int $orderId): void
    {
        $order = Order::find($orderId);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'created_by' => $userId,
            'order_id' => $order->id,
            'amount' => $amount,
            'type' => WalletTransactionType::CREDIT->value,
            'is_success' => true,
            'reason' => WalletTransactionReason::REFUND->value,
        ]);

        $wallet->increment('balance', $amount);
    }

    protected function processOrderPayment(Wallet $wallet, float $amount, ?int $orderId): void
    {
        $order = Order::find($orderId);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'created_by' => $order->user_id,
            'order_id' => $order->id,
            'amount' => $amount,
            'type' => WalletTransactionType::DEBIT->value,
            'is_success' => true,
            'reason' => WalletTransactionReason::ORDER_PAYMENT->value,
        ]);

        $wallet->decrement('balance', $amount);
    }

    protected function processWalletPayment(Wallet $wallet, float $amount): void
    {
        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'created_by' => $wallet->user_id,
            'wallet_payment_id' => $wallet->lastTransaction->id,
            'amount' => $amount,
            'type' => WalletTransactionType::CREDIT->value,
            'is_success' => true,
            'reason' => WalletTransactionReason::WALLET_PAYMENT->value,
        ]);

        $wallet->increment('balance', $amount);
    }

    protected function processCustomerWalletCredit(Wallet $wallet, float $amount, int $userId): void
    {
        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'created_by' => $userId,
            'amount' => $amount,
            'type' => WalletTransactionType::CREDIT->value,
            'is_success' => true,
            'reason' => WalletTransactionReason::WALLET_CREDIT->value,
        ]);

        $wallet->increment('balance', $amount);
    }

    public function getWalletTransactions(): LengthAwarePaginator
    {
        /* @var User $user */
        $user = auth()->user();

        return QueryBuilder::for(WalletTransaction::where('wallet_id', $user->wallet->id))
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::TRANSACTIONS_PER_PAGE));
    }
}
