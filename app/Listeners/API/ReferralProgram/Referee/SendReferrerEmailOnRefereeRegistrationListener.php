<?php

namespace App\Listeners\API\ReferralProgram\Referee;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendReferrerEmailOnRefereeRegistrationListener implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct(protected EmailService $emailService)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(CustomerRegistered $event): void
    {
        if ($event->user->referredBy) {
            $this->emailService->sendEmail(
                [[$event->user->referredBy->email => $event->user->referredBy->first_name ?? '']],
                EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_REFEREE_REFERRAL_SIGN_UP],
                EmailService::TEMPLATE_SLUG_REFEREE_REFERRAL_SIGN_UP,
                [
                    'REDIRECT_URL' => config('app.url').'/dashboard/referral-program/referrals',
                ]
            );
        }
    }
}
