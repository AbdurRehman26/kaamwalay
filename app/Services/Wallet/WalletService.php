<?php

namespace App\Services\Wallet;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletPayment;
use App\Models\WalletTransaction;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\QueryBuilder;

class WalletService
{
    protected const TRANSACTIONS_PER_PAGE = 15;

    public function createWallet(array $attributes)
    {
        $wallet = new Wallet($attributes);
        $wallet->save();
    }

    public function processTransaction(int $walletId, float $amount, string $reason, int $userId, ?int $orderId)
    {
        $wallet = Wallet::find($walletId);

        if ($reason === WalletTransaction::REASON_REFUND) {
            $this->processRefund($wallet, $amount, $userId, $orderId);
        }

        if ($reason === WalletTransaction::REASON_ORDER_PAYMENT) {
            $this->processOrderPayment($wallet, $amount, $orderId);
        }

        if ($reason === WalletTransaction::REASON_WALLET_PAYMENT) {
            $this->processWalletPayment($wallet, $amount);
        }
    }

    private function processRefund(Wallet $wallet, float $amount, int $userId, ?int $orderId)
    {
        dd(23);
        $order = Order::first($orderId);

        WalletTransaction::create([
            'wallet_id' => $wallet->id,
            'user_id' => $userId,
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

    public function getWalletPayments(): LengthAwarePaginator
    {
        /* @var User $user */
        $user = auth()->user();

        return QueryBuilder::for(WalletPayment::where('wallet_id', $user->wallet->id))
            ->defaultSort('-created_at')
            ->paginate(request('per_page', self::TRANSACTIONS_PER_PAGE));
    }
}
