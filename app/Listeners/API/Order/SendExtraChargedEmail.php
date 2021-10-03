<?php

namespace App\Listeners\API\Order;

use App\Events\API\Customer\Order\ExtraAmountCharged;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendExtraChargedEmail
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

    /**
     * Handle the event.
     *
     * @param  ExtraAmountCharged  $amountCharged
     * @return void
     */
    public function handle(ExtraAmountCharged $amountCharged)
    {
        //
    }
}
