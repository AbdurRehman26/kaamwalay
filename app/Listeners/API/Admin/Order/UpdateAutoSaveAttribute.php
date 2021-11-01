<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\OrderUpdated;

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

    public function handle(OrderUpdated $event)
    {
        $order = $event->order;

        $order->fill([
            'auto_saved_at' => now(),
        ]);

        $order->save();
    }
}
