<?php

namespace App\Notifications\Order;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Notifications\PushNotification;

class OrderStatusChanged extends PushNotification
{
    protected const INTENT = 'SUBMISSION_DETAIL_VIEW';
    protected const STATUS_MAP = [
        OrderStatus::PLACED => 'placed',
        OrderStatus::CONFIRMED => 'confirmed',
        OrderStatus::GRADED => 'graded',
        OrderStatus::SHIPPED => 'shipped',
    ];

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public Order $order) {}

    protected function getTitle(): string
    {
        return 'Submission ' . ucfirst(self::STATUS_MAP[$this->order->order_status_id]);
    }

    protected function getBody(): string
    {
        return "Your submission # {$this->order->order_number} has been " . self::STATUS_MAP[$this->order->order_status_id];
    }

    protected function getIntent(): array
    {
        return [
            'intent' => self::INTENT,
            'object_id' => $this->order->id,
        ];
    }
}
