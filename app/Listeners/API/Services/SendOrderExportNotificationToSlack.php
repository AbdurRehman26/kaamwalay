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
        \Log::info("Ia maher");
        if (! app()->environment('production')) {
            return;
        }

        Notification::route('slack', 'https://hooks.slack.com/services/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')
            ->notify(new \App\Notifications\OrderExport($filePath, $date));
    }
}
