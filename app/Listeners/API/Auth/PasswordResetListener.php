<?php

namespace App\Listeners\API\Auth;

use App\Services\EmailService;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class PasswordResetListener implements ShouldBeEncrypted
{
    public function __construct(protected EmailService $emailService)
    {
    }

    public function handle(PasswordReset $event): void
    {
        $user = $event->user;
        $this->emailService->sendEmail(
            $user->email,
            $user->name,
            $this->emailService::SUBJECT[$this->emailService::TEMPLATE_PASSWORD_CHANGED],
            $this->emailService::TEMPLATE_PASSWORD_CHANGED,
            [
                'USER_NAME' => $user->name,
            ],
        );
    }
}
