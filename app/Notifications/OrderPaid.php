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
        $emoji = ':robot_face:';
        $userName = $this->order->user->getFullName();

        if (! $userName) {
            $userName = $this->order->shippingAddress->getFullName();
        }

        if ($this->order->grand_total >= 5000) {
            $emoji = ':space_invader:';
        }

        return (new SlackMessage)
            ->from('Robograding', $emoji)
            ->content("{$userName}, {$this->order->grand_total}, $paymentCode, {$this->order->order_number}, {$totalCards}");
    }
}
