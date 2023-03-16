<?php

namespace App\Listeners\API\ReferralProgram\ReferrerPayouts;

use App\Events\API\Admin\ReferralProgram\PayoutInitiatedEvent;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldQueue;

class PayoutInitiatedListener implements ShouldQueue
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
    public function handle(PayoutInitiatedEvent $event): void
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
