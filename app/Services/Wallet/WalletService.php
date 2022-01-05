<?php

namespace App\Services\Wallet;

use App\Exceptions\API\Wallet\InvalidWalletTransactionException;
use App\Models\Order;
use App\Models\Wallet;
use App\Models\WalletTransaction;

class WalletService
{
    protected const TRANSACTIONS_PER_PAGE = 15;

    public function createWallet(array $attributes): void
    {
        $wallet = new Wallet($attributes);
        $wallet->save();
    }

    public function processTransaction(int $walletId, float $amount, string $reason, int $userId, ?int $orderId): void
    {
        $wallet = Wallet::find($walletId);

        match ($reason) {
            WalletTransaction::REASON_REFUND => $this->processRefund($wallet, $amount, $userId, $orderId),
            WalletTransaction::REASON_ORDER_PAYMENT => $this->processOrderPayment($wallet, $amount, $orderId),
            WalletTransaction::REASON_WALLET_CREDIT => $this->processCustomerWalletCredit($wallet, $amount, $userId),
            WalletTransaction::REASON_WALLET_PAYMENT => $this->processWalletPayment($wallet, $amount),
            default => new InvalidWalletTransactionException,
        };
    }

    private function processRefund(Wallet $wallet, float $amount, int $userId, ?int $orderId): void
    {
        $order = Order::find($orderId);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'initiated_by' => $userId,
            'order_id' => $order->id,
            'type' => WalletTransaction::TYPE_CREDIT,
            'is_success' => true,
            'reason' => WalletTransaction::REASON_REFUND,
        ]);

        $wallet->increment('balance', $amount);
    }

    private function processOrderPayment(Wallet $wallet, float $amount, ?int $orderId): void
    {
        $order = Order::find($orderId);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'initiated_by' => $order->user_id,
            'order_id' => $order->id,
            'type' => WalletTransaction::TYPE_DEBIT,
            'is_success' => true,
            'reason' => WalletTransaction::REASON_ORDER_PAYMENT,
        ]);

        $wallet->decrement('balance', $amount);
    }

    private function processWalletPayment(Wallet $wallet, float $amount): void
    {
        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'initiated_by' => $wallet->user_id,
            'wallet_payment_id' => $wallet->lastTransaction->id,
            'type' => WalletTransaction::TYPE_CREDIT,
            'is_success' => true,
            'reason' => WalletTransaction::REASON_WALLET_PAYMENT,
        ]);

        $wallet->increment('balance', $amount);
    }

    private function processCustomerWalletCredit(Wallet $wallet, float $amount, int $userId): void
    {
        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'initiated_by' => $userId,
            'type' => WalletTransaction::TYPE_CREDIT,
            'is_success' => true,
            'reason' => WalletTransaction::REASON_WALLET_CREDIT,
        ]);

        $wallet->increment('balance', $amount);
    }
}
