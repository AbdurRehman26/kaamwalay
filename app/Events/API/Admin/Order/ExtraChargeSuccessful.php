<?php

namespace App\Events\API\Admin\Order;

use App\Models\OrderPayment;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ExtraChargeSuccessful
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(public OrderPayment $orderPayment)
    {
    }
}
