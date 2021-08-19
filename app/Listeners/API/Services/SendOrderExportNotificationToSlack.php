<?php

namespace App\Listeners\API\Services;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Notification;

class SendOrderExportNotificationToSlack implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 3;

    public function handle(string $filePath, string $date)
    {
        if (! app()->environment('production')) {
            return;
        }

        Notification::route('slack', 'https://hooks.slack.com/services/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')
            ->notify(new \App\Notifications\OrderExport($filePath, $date));
    }
}
