<?php

namespace App\Listeners\API\Services;

use App\Events\API\Admin\Order\RefundSuccessful;
use App\Models\OrderPayment;
use App\Notifications\OrderPaymentProcessedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendRefundNotificationToSlack implements ShouldQueue
{
    use InteractsWithQueue;

    public int $tries = 3;

    /**
     * Handle the event.
     *
     * @param  RefundSuccessful  $event
     * @return void
     */
    public function handle(RefundSuccessful $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
            ->notify(new OrderPaymentProcessedNotification($event->order, OrderPayment::TYPE_REFUND));
    }
}
