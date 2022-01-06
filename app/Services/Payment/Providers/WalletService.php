<?php

namespace App\Services\Payment\Providers;

use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\Wallet;
use App\Models\WalletTransaction;

class WalletService implements PaymentProviderServiceInterface
{
    public function charge(Order $order): array
    {
        Wallet::validateWalletAmount($this->getAmount($order));

        /*Todo
        * Fire event to deduct from wallet
        */

        $this->deductAmountFromWallet($order->user->wallet, $order);

        return $this->prepareResponseData($order);
    }

    protected function deductAmountFromWallet(Wallet $wallet, Order $order): void
    {
        $wallet->makeTransaction(
            $this->getAmount($order),
            WalletTransaction::REASON_ORDER_PAYMENT,
            $order->user_id,
            $order
        );
    }

    public function verify(Order $order, string $paymentIntentId): bool
    {
    }

    protected function getAmount(Order $order): int
    {
        return $order->amount_paid_from_wallet;
    }

    public function calculateFee(OrderPayment $orderPayment): float
    {
        /* Currently, there is no fee for paying from wallet */
        return 0;
    }

    protected function prepareResponseData(Order $order): array
    {
        return [
            'success' => true,
            'request' => null,
            'response' => null,
            'payment_provider_reference_id' => null,
            'amount' => $this->getAmount($order),
            'type' => OrderPayment::TYPE_ORDER_PAYMENT,
            'notes' => "Payment for Order # {$order->order_number}",
        ];
    }
}
