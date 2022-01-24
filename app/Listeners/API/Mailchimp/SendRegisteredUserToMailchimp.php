<?php

namespace App\Listeners\API\Mailchimp;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\Mailchimp\SendCustomersToMailchimpService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class SendRegisteredUserToMailchimp implements ShouldQueue, ShouldBeEncrypted
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

    public function handle(CustomerRegistered $event): void
    {
        $this->service->sendNewUsers($event->user, SendCustomersToMailchimpService::LIST_NAME_SIGN_UP_USERS);
    }
}
