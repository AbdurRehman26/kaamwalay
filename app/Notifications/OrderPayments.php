<?php

namespace App\Notifications;

use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use App\Models\Order;
use App\Models\OrderPayment;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class OrderPayments extends Notification
{
    public function __construct(public Order $order, public int $paymentType)
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

    /**
     * Get the Slack representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\SlackMessage
     */
    public function toSlack($notifiable)
    {
        return (new SlackMessage)
        ->from('Robograding', $this->getEmoji())
        ->content($this->getMessage());
    }

    protected function getMessage():string
    {
        $paymentCode = ucfirst($this->order->paymentMethod->code);
        $message = null;
    
        switch ($this->paymentType) {
            case OrderPayment::TYPE_ORDER_PAYMENT:
                $message = $this->getMessageForOrderPaid($paymentCode);

                break;
            case OrderPayment::TYPE_EXTRA_CHARGE:
                $message = $this->getMessageForExtraChargeAndRefund($paymentCode);

                break;
            case OrderPayment::TYPE_REFUND:
                $message = $this->getMessageForExtraChargeAndRefund($paymentCode);

                break;
          }

        return $message;
    }

    protected function getMessageForOrderPaid(String $paymentCode):string
    {
        $totalCards = $this->order->orderItems->sum('quantity');
        $customerFullName = $this->order->user->getFullName();
        
        if (empty($customerFullName)) {
            $customerFullName = $this->order->shippingAddress->getFullName();
        }
        
        return "{$customerFullName}, {$this->order->grand_total}, $paymentCode, {$this->order->order_number}, {$totalCards}";
    }

    protected function getMessageForExtraChargeAndRefund(String $paymentCode):string
    {
        $orderPayment = new OrderPaymentResource($this->order->lastOrderPayment);
        $adminName = $orderPayment->user->getFullName();

        if ($this->paymentType === OrderPayment::TYPE_EXTRA_CHARGE) {
            return "Extra Charge, {$orderPayment->amount}, {$paymentCode}, {$this->order->order_number}, by {$adminName}";
        }
        
        return "Refund, -{$orderPayment->amount}, {$paymentCode}, {$this->order->order_number}, by {$adminName}";
    }

    protected function getEmoji():string
    {
        $emoji = ':robot_face:';
        
        if ($this->paymentType === OrderPayment::TYPE_ORDER_PAYMENT && $this->order->grand_total >= 5000) {
            $emoji = ':space_invader:';
        }

        return $emoji;
    }
}
