<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class SendWelcomeEmail implements ShouldBeEncrypted
{
    public function __construct(protected EmailService $emailService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        $user = $event->user;
        $this->emailService->sendEmail(
            [[$user->email => $user->first_name ?? '']],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_CUSTOMER_WELCOME],
            EmailService::TEMPLATE_SLUG_CUSTOMER_WELCOME
        );
    }
}
