<?php

namespace App\Events\API\Admin\OrderItem;

use App\Models\CardProduct;
use App\Models\OrderItem;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderItemCardChangedEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(
        public OrderItem $orderItem,
        public CardProduct $previousCardProduct
    ) {
        //
    }
}