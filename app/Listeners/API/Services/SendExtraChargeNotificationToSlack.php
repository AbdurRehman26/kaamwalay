<?php

namespace App\Listeners\API\Services;

use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendExtraChargeNotificationToSlack implements ShouldQueue
{
    use InteractsWithQueue;

    /**
    * The number of times the job may be attempted.
    *
    * @var int
    */
    public $tries = 3;

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

        $paymentType = 'ExtraCharge';

        Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
            ->notify(new \App\Notifications\OrderPayments($event->order, $paymentType));
    }
}
