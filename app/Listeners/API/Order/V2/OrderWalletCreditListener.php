<?php

namespace App\Listeners\API\Order\V2;

use App\Enums\Wallet\WalletTransactionReason;
use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Wallet\WalletService;

class OrderWalletCreditListener
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
     *
     * @param  OrderPaid  $event
     * @return void
     */
    public function handle(OrderPaid $event): void
    {
        if (config('robograding.feature_order_wallet_credit_enabled') && $event->order->isNotOlderThanOneDay() && !$event->order->hasCoupon()) {
            $this->processAddWalletCredit($event);
        }
    }

    /**
     * @param  OrderPaid  $event
     * @return void
     */
    protected function processAddWalletCredit(OrderPaid $event): void
    {
        $this->walletService->processTransaction(
            $event->order->user->wallet->id,
            ($event->order->grand_total * 5 / 100),
            WalletTransactionReason::WALLET_CREDIT,
            $event->order->user_id,
            $event->order->id
        );
    }
}
