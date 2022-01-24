<?php

namespace App\Listeners\API\Mailchimp;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Mailchimp\SendCustomersToMailchimpService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class SendOrderPaidUserToMailchimp implements ShouldQueue, ShouldBeEncrypted
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected SendCustomersToMailchimpService $service)
    {
        //
    }

    public function handle(OrderPaid $event): void
    {
        $this->service->sendNewUsers($event->order->user, SendCustomersToMailchimpService::LIST_NAME_ORDER_PAID_CUSTOMERS);
    }
}
