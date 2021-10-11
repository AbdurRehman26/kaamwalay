<?php

namespace App\Events\API\Admin\Order;

use App\Http\Resources\API\Customer\Order\OrderPaymentResource;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldBeEncrypted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ExtraChargeSuccessful implements ShouldQueue, ShouldBeEncrypted
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(public OrderPaymentResource $orderPayment)
    {
    }
}
