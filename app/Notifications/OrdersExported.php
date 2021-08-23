<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class OrdersExported extends Notification
{
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
            ->from('Robograding', ':robot_face:')
            ->content("Orders Export.\n Date: {$this->date}, File: {$this->filePath}");
    }
}
