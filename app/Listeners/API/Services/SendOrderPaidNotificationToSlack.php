<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendOrderPaidNotificationToSlack implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 3;

    public function handle(OrderPaid $event): void
    {
        if (! app()->environment('production')) {
            return;
        }

        Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
            ->notify(new \App\Notifications\OrderPaid($event->order));
    }
}
