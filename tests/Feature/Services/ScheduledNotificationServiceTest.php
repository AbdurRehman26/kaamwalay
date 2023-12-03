<?php

use App\Models\ScheduledNotification;
use App\Models\User;
use App\Notifications\Marketing\RegisteredUserMarketingCampaignNotification;
use App\Services\ScheduledNotificationService;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('schedules email', function () {
    $sendAt = now()->addDay();
    $payload = [['content' => 'This is a test content.']];

    resolve(ScheduledNotificationService::class)->scheduleNotification(
        $sendAt,
        RegisteredUserMarketingCampaignNotification::class,
        User::class,
        $this->user->id,
        $payload,
        'RegisteredUserMarketingSmsCampaignCheck'
    );

    assertDatabaseCount('scheduled_notifications', 1);
    assertDatabaseHas('scheduled_notifications', [
        'notification_class' => 'App\Notifications\Marketing\RegisteredUserMarketingCampaignNotification',
        'notifiable_type' => 'App\Models\User',
        'notifiable_id' => $this->user->id,
        'send_at' => $sendAt->toDateTimeString(),
        'payload' => serialize($payload),
        'is_sent' => 0,
        'check_class' => 'RegisteredUserMarketingSmsCampaignCheck',
    ]);
});

it('processes scheduled notifications', function () {
    Notification::fake();
    $content = 'This is a test content.';

    ScheduledNotification::factory()->count(3)->create([
        'notification_class' => 'App\Notifications\Marketing\RegisteredUserMarketingCampaignNotification',
        'payload' => serialize(['content' => $content]),
        'send_at' => now()->addMinutes(5),
        'is_sent' => 0,
        'check_class' => null,
        'notifiable_id' => $this->user->id,
    ]);

    resolve(ScheduledNotificationService::class)->processScheduledNotifications();
    Notification::assertNothingSent();

    $this->travel(6)->minutes();
    resolve(ScheduledNotificationService::class)->processScheduledNotifications();
    Notification::assertCount(3);
    Notification::assertSentTo(
        $this->user,
        function (RegisteredUserMarketingCampaignNotification $notification) use ($content) {
            return $notification->content === $content;
        }
    );
});
