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
     *
     * @param  OrderPaid  $event
     * @return void
     */
    public function handle(OrderPaid $event): void
    {
        if (! $event->order->isOlderThanOneDay() && ! $event->order->hasCoupon() && config('robograding.feature_order_wallet_credit_enabled')) {
            $this->addCreditToCustomerWallet($event);
        }
    }

    /**
     * @param  OrderPaid  $event
     * @return void
     */
    protected function addCreditToCustomerWallet(OrderPaid $event): void
    {
        $this->walletService->processTransaction(
            $event->order->user->wallet->id,
            ($event->order->grand_total * config('robograding.feature_order_wallet_credit_percentage')) / 100,
            WalletTransactionReason::WALLET_CREDIT,
            $event->order->user_id,
            $event->order->id
        );
    }
}
