<?php

namespace App\Listeners\API\Mailchimp;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\MailchimpService;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderPaidUserToMailchimp implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected MailchimpService $mailchimpService)
    {
        //
    }

    public function handle(OrderPaid $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        $this->mailchimpService->addUserToList($event->order->user, MailchimpService::LIST_NAME_ORDER_PAID_CUSTOMERS);
    }
}
