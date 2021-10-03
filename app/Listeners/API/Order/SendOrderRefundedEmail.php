<?php

namespace App\Listeners\API\Order;

use App\Events\API\Customer\Order\OrderRefunded;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendOrderRefundedEmail implements ShouldBeEncrypted
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected EmailService $emailService)
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  OrderRefunded  $event
     * @return void
     */
    public function handle(OrderRefunded $event)
    {
        $user = $event->order->user;
        $this->emailService->sendEmail(
            $user->email,
            $user->name,
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_SLUG_ORDER_REFUNDED],
            $this->emailService::TEMPLATE_SLUG_ORDER_REFUNDED,
            [
                'TOTAL_AMOUNT' => 100,
            ],
        );
    }
}
