<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderExport;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendOrderExportNotificationToSlack implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 3;

    public function handle(OrderExport $event): void
    {
        if (! app()->environment('production')) {
            return;
        }

        Notification::route('slack', 'https://hooks.slack.com/services/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')
            ->notify(new \App\Notifications\OrderExport($event->filePath, $event->date));
    }
}
