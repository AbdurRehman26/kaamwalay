<?php

namespace App\Services\Wallet;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\Wallet;
use App\Models\WalletTransaction;

class WalletService
{
    public function createWallet(array $attributes)
    {
        $wallet = new Wallet($attributes);
        $wallet->save();
    }

    public function processTransaction(int $walletId, float $amount, string $reason, ?int $orderId)
    {
        $wallet = Wallet::find($walletId);

        if ($reason === WalletTransaction::REASON_REFUND) {
            $this->processRefund($wallet, $amount, $orderId);
        }

        if ($reason === WalletTransaction::REASON_ORDER_PAYMENT) {
            $this->processOrderPayment($wallet, $amount, $orderId);
        }

        if ($reason === WalletTransaction::REASON_WALLET_PAYMENT) {
            $this->processWalletPayment($wallet, $amount);
        }
    }

    private function processRefund(Wallet $wallet, float $amount, ?int $orderId)
    {
        $order = Order::first($orderId);

        OrderPayment::create([
            'payment_method_id' => $order->firstOrderPayment->payment_method_id,
            'type' => OrderPayment::TYPE_REFUND_TO_WALLET,
            'amount' => $amount,
        ]);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'user_id' => '',
            'order_id' => $order->id,
            'type' => WalletTransaction::TYPE_CREDIT,
            'is_success' => true,
            'reason' => WalletTransaction::REASON_REFUND,
        ]);

        $wallet->increment('balance', $amount);
    }

    private function processOrderPayment($wallet, float $amount, ?int $orderId)
    {
        $order = Order::first($orderId);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'user_id' => '',
            'order_id' => $order->id,
            'type' => WalletTransaction::TYPE_DEBIT,
            'is_success' => true,
            'reason' => WalletTransaction::REASON_ORDER_PAYMENT,
        ]);

        $wallet->decrement('balance', $amount);
    }

    private function processWalletPayment(Wallet $wallet, float $amount)
    {
        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'user_id' => '',
            'wallet_payment_id' => $wallet->lastTransaction->id,
            'type' => WalletTransaction::TYPE_CREDIT,
            'is_success' => true,
            'reason' => WalletTransaction::REASON_WALLET_PAYMENT,
        ]);

        $wallet->decrement('balance', $amount);
    }
}
