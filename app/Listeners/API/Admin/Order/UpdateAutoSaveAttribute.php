<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\OrderItemUpdated;

class UpdateAutoSaveAttribute
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function handle(OrderItemUpdated $event)
    {
        $order = $event->order;
        
        $order->fill([
            'auto_saved_at' => now(),
        ]);

        $order->save();
    }
}
