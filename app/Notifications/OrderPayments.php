<?php

namespace App\Notifications;

use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class OrderPayments extends Notification
{
    public function __construct(public Order $order, public string $paymentType)
    {
    }

    /**
      * Get the notification's delivery channels.
      *
      * @param  mixed  $notifiable
      * @return array
      */
    public function via($notifiable)
    {
        return ['slack'];
    }

    private function getMessage():string
    {
        $paymentCode = ucfirst($this->order->paymentMethod->code);
        $orderPayment = new OrderPaymentResource($this->order->lastOrderPayment);
        $adminName = $orderPayment->user?->first_name . ' ' .$orderPayment->user?->last_name;
        $totalCards = $this->order->orderItems->sum('quantity');
        $message = null;
        $customerFullName = $this->order->user->getFullName();
        
        if (empty($customerFullName)) {
            $customerFullName = $this->order->shippingAddress->getFullName();
        }
        
        if ($this->paymentType == 'OrderPaid') {
            $message = "{$customerFullName}, {$this->order->grand_total}, $paymentCode, {$this->order->order_number}, {$totalCards}";
        }

        if ($this->paymentType == 'ExtraCharge') {
            $message = "Extra Charge, {$orderPayment->amount}, {$paymentCode}, {$this->order->order_number}, by {$adminName}";
        }

        if ($this->paymentType == 'Refund') {
            $message = "Refund, -{$orderPayment->amount}, {$paymentCode}, {$this->order->order_number}, by {$adminName}";
        }

        return $message;
    }

    private function getEmoji():string
    {
        $emoji = ':robot_face:';
        $orderPayment = new OrderPaymentResource($this->order->firstOrderPayment);
        
        if ($orderPayment->type === OrderPayment::TYPE_ORDER_PAYMENT && $orderPayment->amount > 5000) {
            $emoji = ':space_invader:';
        }

        return $emoji;
    }

    /**
     * Get the Slack representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\SlackMessage
     */
    public function toSlack($notifiable)
    {
        $SLACK_USERNAME = 'Robograding';

        return (new SlackMessage)
        ->from($SLACK_USERNAME, $this->getEmoji())
        ->content($this->getMessage());
    }
}
