<?php

namespace App\Listeners\API\Auth;

use App\Events\API\Auth\CustomerRegistered;
use App\Services\EmailService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class ReferrerReminder implements ShouldBeEncrypted, ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected EmailService $emailService)
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param CustomerRegistered  $event
     * @return void
     */
    public function handle(CustomerRegistered $event)
    {
        $user = $event->user;
        $this->emailService->scheduleEmail(
            now()->addDays(3),
            [[$user->email => $user->first_name ?? '']],
            EmailService::SUBJECT[EmailService::TEMPLATE_SLUG_REFEREE_REFER_NOW],
            EmailService::TEMPLATE_SLUG_REFEREE_REFER_NOW,
            [
                'REDIRECT_URL' => config('app.url') . '/dashboard/referral-program/main',
                'PERCENTAGE_VALUE' => config('robograding.feature_referral_discount_percentage'),
            ],
            true,
            'CreateReferrerReminderCheck',
            ['user' => $user]
        );
    }
}
