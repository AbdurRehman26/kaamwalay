<?php

namespace App\Notifications;

use App\Models\Order;
use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class ExtraCharge extends Notification
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
        $orderPayment = new OrderPaymentResource($this->order->lastOrderPayment);
        $adminName = $orderPayment->user->first_name . ' ' .$orderPayment->user->last_name;
        
        return (new SlackMessage)
            ->from('Robograding', ':robot_face:')
            ->content("Extra Charge, {$orderPayment->amount}, {$paymentCode}, {$this->order->order_number}, by {$adminName}");
    }
}
