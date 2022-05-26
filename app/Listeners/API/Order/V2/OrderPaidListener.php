<?php

namespace App\Listeners\API\Order\V2;

use App\Enums\Wallet\WalletTransactionReason;
use App\Events\API\Customer\Order\OrderPaid;
use App\Services\EmailService;
use App\Services\Order\V2\OrderService;
use App\Services\Wallet\WalletService;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderPaidListener implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected EmailService $emailService, protected OrderService $orderService)
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
        $this->processEmails($event);
        $this->processAddWalletCredit($event);
    }

    /**
     * @param  OrderPaid  $event
     * @return void
     */
    protected function processEmails(OrderPaid $event): void
    {
        $this->emailService->sendEmail(
            [[$event->order->user->email => $event->order->user->getFullName()]],
            $this->emailService->getSubjectByTemplate(EmailService::TEMPLATE_SLUG_CUSTOMER_ORDER_PAID),
            EmailService::TEMPLATE_SLUG_CUSTOMER_ORDER_PAID,
            $this->orderService->getDataForCustomerOrderPaid($event->order)
        );
    }

    /**
     * @param  OrderPaid  $event
     * @return void
     */
    protected function processAddWalletCredit(OrderPaid $event): void
    {
        $walletService = resolve(WalletService::class);

        $walletService->processTransaction(
            $event->order->user->wallet->id,
            ($event->order->grand_total * 5 / 100),
            WalletTransactionReason::WALLET_CREDIT,
            $event->order->user_id,
            $event->order->id
        );
    }
}
