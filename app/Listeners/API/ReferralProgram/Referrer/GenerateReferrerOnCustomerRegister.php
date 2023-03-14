<?php

namespace App\Listeners\API\ReferralProgram\Referrer;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\EmailService;
use App\Services\ReferralProgram\ReferrerService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;

class GenerateReferrerOnCustomerRegister implements ShouldBeEncrypted
{
    public function __construct(protected ReferrerService $referrerService, protected EmailService $emailService)
    {
    }

    public function handle(CustomerRegistered $event): void
    {
        $this->referrerService->create($event->user);
        
        if ($event->user->referredBy) {
            $this->emailService = resolve(EmailService::class);
            $this->emailService->sendEmail(
                [[$event->user->referredBy->email => $event->user->referredBy->first_name ?? '']],
                EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_REFEREE_REFERRAL_SIGN_UP],
                EmailService::TEMPLATE_SLUG_REFEREE_REFERRAL_SIGN_UP,
                [
                    'REDIRECT_URL' => config('app.url') . '/dashboard/referral-program/referrals',
                ]
            );
        }
    }
}
