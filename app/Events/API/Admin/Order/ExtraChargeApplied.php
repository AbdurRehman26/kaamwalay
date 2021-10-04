<?php

namespace App\Events\API\Admin\Order;

use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ExtraChargeApplied implements ShouldQueue, ShouldBeEncrypted
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(public Order $order)
    {
    }
}
