<?php

namespace App\Events\API\Admin\Order;

use App\Models\Order;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UnpaidOrderExtraCharge
{
    use Dispatchable, SerializesModels;

    public function __construct(public Order $order)
    {
        //
    }
}
