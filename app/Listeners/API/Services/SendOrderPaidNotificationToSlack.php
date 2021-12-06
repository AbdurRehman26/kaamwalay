<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Models\OrderPayment;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendOrderPaidNotificationToSlack implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 3;

    public function handle(OrderPaid $event): void
    {
        if (app()->environment('local')) {
            return;
        }

        Notification::route('slack', config('services.slack.channel_webhooks.closes_ags'))
            ->notify(new \App\Notifications\OrderPayments($event->order, OrderPayment::TYPE_ORDER_PAYMENT));
    }
}
