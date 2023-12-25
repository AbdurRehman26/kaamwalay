<?php

namespace App\Listeners\API\Marketing;

use App\Events\API\Auth\CustomerRegistered;
use App\Models\User;
use App\Notifications\Marketing\RegisteredUserMarketingCampaignNotification;
use App\Services\ScheduledNotificationService;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendRegisteredUserMarketingSmsCampaign implements ShouldBeEncrypted, ShouldQueue
{
    public function __construct(protected ScheduledNotificationService $scheduledNotificationService)
    {
        //
    }

    public function handle(CustomerRegistered $event): void
    {
        $user = $event->user;

        if (! $user->wantsToReceiveMarketingContent() || ! $user->phone) {
            return;
        }

        $user->notify(new RegisteredUserMarketingCampaignNotification('Thank you for joining AGS! Whenever you’re ready, you can start your first submission here: '.config('app.url')));

        $this->scheduledNotificationService->scheduleNotification(
            now()->addDays(3),
            RegisteredUserMarketingCampaignNotification::class,
            User::class,
            $user->id,
            ['content' => 'Our robots are excited to get your first card submission with Robograding '.config('app.url').'. Text or call us at 929-209-3925 if you need any help to get started on your submission or if you just want to chat.'],
            'RegisteredUserMarketingSmsCampaignCheck'
        );

        $this->scheduledNotificationService->scheduleNotification(
            now()->addDays(7),
            RegisteredUserMarketingCampaignNotification::class,
            User::class,
            $user->id,
            ['content' => 'It’s officially our 1 week anniversary together! We were really looking forward to seeing your best cards. At least text us a sneak peek.'],
            'RegisteredUserMarketingSmsCampaignCheck'
        );

        $this->scheduledNotificationService->scheduleNotification(
            now()->addDays(10),
            RegisteredUserMarketingCampaignNotification::class,
            User::class,
            $user->id,
            ['content' => 'We have a surprise for you! Here’s 20% off your entire order. Use code: COOLGRADE20. '.config('app.url')],
            'RegisteredUserMarketingSmsCampaignCheck'
        );

        $this->scheduledNotificationService->scheduleNotification(
            now()->addDays(15),
            RegisteredUserMarketingCampaignNotification::class,
            User::class,
            $user->id,
            ['content' => 'I see you’re playing hard to get. We have a special gift just for you! Go ahead and submit your first card for free. This one is on us. Use code: ONETIMEFREE when submitting here '.config('app.url')],
            'RegisteredUserMarketingSmsCampaignCheck'
        );

        $this->scheduledNotificationService->scheduleNotification(
            now()->addDays(20),
            RegisteredUserMarketingCampaignNotification::class,
            User::class,
            $user->id,
            ['content' => 'We haven’t heard from you in a while. Hope all is well. Let us know why you haven’t started a submission or any feedback you have for us.'],
            'RegisteredUserMarketingSmsCampaignCheck'
        );
    }
}
