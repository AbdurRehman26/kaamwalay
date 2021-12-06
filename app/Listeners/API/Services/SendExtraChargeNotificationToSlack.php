<?php

namespace App\Listeners\API\Services;

use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Models\OrderPayment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendExtraChargeNotificationToSlack implements ShouldQueue
{
    use InteractsWithQueue;

    public int $tries = 3;

    /**
     * Handle the event.
     *
     * @param  ExtraChargeSuccessful  $event
     * @return void
     */
    public function handle(ExtraChargeSuccessful $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
            ->notify(new \App\Notifications\OrderPayments($event->order, OrderPayment::TYPE_EXTRA_CHARGE));
    }
}
