<?php

namespace App\Listeners\API\Order;

use App\Events\API\Order\OrderStatusChangedEvent;
use App\Models\OrderStatus;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class OrderStatusChangedListener implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  OrderStatusChangedEvent  $event
     * @return void
     */
    public function handle(OrderStatusChangedEvent $event)
    {
        switch ($event->orderStatus->id) {
            case OrderStatus::
        }
    }
}
