<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\ExtraChargeSuccessful;
use App\Services\Payment\PaymentService;

class ExtraChargeSuccessfulListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected PaymentService $paymentService)
    {
    }

    public function handle(ExtraChargeSuccessful $event): void
    {
    }
}
