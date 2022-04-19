<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPlaced;
use App\Notifications\OrderPlacedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Notification;

class SendOrderPlacedNotificationToSlack implements ShouldQueue
{
    public function handle(OrderPlaced $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
            ->notify(new OrderPlacedNotification($event->order));
    }
}
