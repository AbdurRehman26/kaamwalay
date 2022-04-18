<?php

namespace App\Listeners\API\Mailchimp;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\MailchimpService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendRegisteredUserToMailchimp implements ShouldQueue, ShouldBeEncrypted
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected MailchimpService $service)
    {
        //
    }

    public function handle(CustomerRegistered $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        $this->service->addUserToList($event->user, MailchimpService::LIST_NAME_SIGN_UP_USERS);
    }
}
