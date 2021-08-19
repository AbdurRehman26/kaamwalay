<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class OrderExport extends Notification
{
    use Queueable;

    public function __construct(public string $filePath, public string $date)
    {
    }

    public function via($notifiable)
    {
        return ['slack'];
    }

    public function toSlack($notifiable)
    {
        return (new SlackMessage)
            ->from('Robograding', ':rocket:')
            ->content("app/Listeners/API/Services/SendOrderExportNotificationToSlack.phpDate : {$this->date}, File Url: {$this->filePath}");
    }
}
