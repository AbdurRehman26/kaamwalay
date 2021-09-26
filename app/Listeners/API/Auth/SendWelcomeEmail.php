<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendWelcomeEmail implements ShouldQueue, ShouldBeEncrypted
{
    public function __construct(protected EmailService $emailService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        $user = $event->user;
        $this->emailService->sendEmail(
            $user->email,
            $user->first_name ?? null,
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_CUSTOMER_WELCOME],
            EmailService::TEMPLATE_SLUG_CUSTOMER_WELCOME
        );
    }
}
