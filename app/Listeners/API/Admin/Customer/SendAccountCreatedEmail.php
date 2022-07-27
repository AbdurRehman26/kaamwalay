<?php

namespace App\Listeners\API\Admin\Customer;

use App\Events\API\Admin\Customer\CustomerCreated;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Support\Facades\Password;

class SendAccountCreatedEmail implements ShouldBeEncrypted
{
    public function __construct(protected EmailService $emailService)
    {
    }

    public function handle(CustomerCreated $event): void
    {
        $user = $event->user;
        $token = Password::broker()->createToken($user);

        $this->emailService->sendEmail(
            [[$user->email => $user->first_name ?? '']],
            EmailService::SUBJECT[EmailService::TEMPLATE_CREATED_USER_ACCESS_ACCOUNT],
            EmailService::TEMPLATE_CREATED_USER_ACCESS_ACCOUNT,
            ['ACCESS_URL' => config('app.url') . '/auth/password/create?token='.$token.'&name='.$user->first_name.'&email='.$user->email],
        );
    }
}
