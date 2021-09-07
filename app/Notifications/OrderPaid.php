<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class OrderPaid extends Notification
{
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
        $totalCards = $this->order->orderItems->sum('quantity');

        return (new SlackMessage)
            ->from('Robograding', ':robot_face:')
            ->content("{$this->order->user->getFullName()}, {$this->order->grand_total}, $paymentCode, {$this->order->order_number}, {$totalCards}");
    }
}
