<?php

namespace App\Notifications\Order;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class OrderStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [PusherChannel::class];
    }

    public function toPushNotification($notifiable)
    {
        return PusherMessage::create()
            ->withWeb(
                PusherMessage::create()
                    ->icon('https://d2eli1wrotxo1h.cloudfront.net/assets/robograding-favicon.png')
                    ->title('Test')
                    ->body("Your {$notifiable->name} account was approved!")
                    ->link('http://robograding.test')
            );
    }
}
