<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class OrderPaid extends Notification
{
    use Queueable;

    public function __construct(public Order $order)
    {
    }

    public function via($notifiable)
    {
        return ['slack'];
    }

    public function toSlack($notifiable)
    {
        $paymentCode = ucfirst($this->order->paymentMethod->code);

        return (new SlackMessage)
            ->from('Robograding', ':rocket:')
            ->content("{$this->order->user->getFullName()}, {$this->order->grand_total}, $paymentCode, {$this->order->order_number}");
    }
}
