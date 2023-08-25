<?php

namespace App\Listeners\API\ReferralProgram\ReferrerPayouts;

use App\Events\API\Admin\ReferralProgram\PayoutCompletedEvent;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class PayoutCompletedListener implements ShouldQueue
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
    public function handle(PayoutCompletedEvent $event): void
    {
        $this->emailService->sendEmail(
            [[$event->referrerPayout->user->email => $event->referrerPayout->user->first_name ?? '']],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_REFEREE_PAYOUT_COMPLETED],
            EmailService::TEMPLATE_SLUG_REFEREE_PAYOUT_COMPLETED,
            [
                'REDIRECT_URL' => config('app.url').'/dashboard/referral-program/withdrawals',
            ]
        );
    }
}
