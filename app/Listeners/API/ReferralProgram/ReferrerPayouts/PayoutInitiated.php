<?php

namespace App\Listeners\API\ReferralProgram\ReferrerPayouts;

use App\Events\API\Admin\ReferralProgram\PayoutInitiated as ReferralProgramPayoutInitiated;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class PayoutInitiated implements ShouldQueue
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
    public function handle(ReferralProgramPayoutInitiated $event): void
    {
        $this->emailService->sendEmail(
            [[$event->referrerPayout->user->email => $event->referrerPayout->user->first_name ?? '']],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_REFEREE_PAYOUT_INITIATED],
            EmailService::TEMPLATE_SLUG_REFEREE_PAYOUT_INITIATED,
            [
                'REDIRECT_URL' => config('app.url') . '/dashboard/referral-program/withdrawals',
            ]
        );
    }
}
