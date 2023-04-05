<?php

namespace App\Listeners\API\Order\V2;

use App\Enums\Wallet\WalletTransactionReason;
use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Wallet\WalletService;

class CreditCustomerForPayNowAndSave
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected WalletService $walletService)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(OrderPaid $event): void
    {
        if (! $event->order->isOlderThanOneDay() && ! $event->order->hasCoupon() && config('robograding.feature_order_wallet_credit_enabled')) {
            $this->addCreditToCustomerWallet($event);
        }
    }

    protected function addCreditToCustomerWallet(OrderPaid $event): void
    {
        $creditAmount = (
            ($event->order->grand_total - $event->order->amount_paid_from_wallet)
            * config('robograding.feature_order_wallet_credit_percentage')
        ) / 100;

        if ($creditAmount > 0) {
            $this->walletService->processTransaction(
                $event->order->user->wallet->id,
                $creditAmount,
                WalletTransactionReason::WALLET_CREDIT,
                $event->order->user_id,
                $event->order->id
            );
        }
    }
}
