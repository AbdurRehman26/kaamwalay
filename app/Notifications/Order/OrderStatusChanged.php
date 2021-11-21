<?php

namespace App\Notifications\Order;

use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\PusherPushNotifications\PusherChannel;
use NotificationChannels\PusherPushNotifications\PusherMessage;

class OrderStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    protected const STATUS_MAP = [
        OrderStatus::PLACED => 'placed',
        OrderStatus::ARRIVED => 'confirmed',
        OrderStatus::GRADED => 'graded',
        OrderStatus::SHIPPED => 'shipped',
    ];

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public Order $order) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable): array
    {
        return [PusherChannel::class];
    }

    /**
     * @throws \NotificationChannels\PusherPushNotifications\Exceptions\CouldNotCreateMessage
     */
    public function toPushNotification($notifiable): PusherMessage
    {
        return PusherMessage::create()
            ->platform('web')
            ->title($this->getTitle())
            ->body($this->getBody())
            ->setOption('web.data', [
                'intent' => 'SUBMISSION_DETAIL_VIEW',
                'object_id' => $this->order->id,
            ]);
    }

    protected function getTitle(): string
    {
        return 'Submission ' . ucfirst(self::STATUS_MAP[$this->order->order_status_id]);
    }

    protected function getBody(): string
    {
        return "Your submission # {$this->order->order_number} has been " . self::STATUS_MAP[$this->order->order_status_id];
    }
}
