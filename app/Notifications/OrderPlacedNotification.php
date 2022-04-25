<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\DB;

class OrderPlacedNotification extends Notification
{
    public function __construct(public Order $order)
    {
    }

    /**
      * Get the notification's delivery channels.
      *
      * @param  mixed  $notifiable
      * @return array
      */
    public function via(mixed $notifiable): array
    {
        return ['slack'];
    }

    /**
     * Get the Slack representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return SlackMessage
     */
    public function toSlack(mixed $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->from('Robograding', ':robot_face:')
            ->content($this->getMessage());
    }

    protected function getMessage(): ?string
    {
        $totalCards = $this->getCardsBreakdown();
        $customerFullName = $this->order->user->getFullName();

        if (empty($customerFullName)) {
            $customerFullName = $this->order->shippingAddress->getFullName();
        }

        return "$customerFullName, {$this->order->grand_total}, UNPAID, {$this->order->order_number}, $totalCards";
    }

    protected function getCardsBreakdown(): string
    {
        return $this->order->orderItems()
            ->join('card_products', 'order_items.card_product_id', 'card_products.id')
            ->leftJoin('card_categories', 'card_products.card_category_id', 'card_categories.id')
            ->groupBy('card_categories.id')
            ->select(DB::raw('SUM(order_items.quantity) as quantity'), DB::raw("COALESCE(card_categories.name, 'Added Manually') as name"))
            ->get()
            ->map(function ($values) {
                return $values['quantity'] . ' ' . $values['name'];
            })
            ->join(' ');
    }
}
