<?php

namespace App\Events\API\Order;

use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusChangedEvent
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(
        public Order $order,
        public OrderStatus $orderStatus
    ) {
    }
}
