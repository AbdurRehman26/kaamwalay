<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\ExtraChargeApplied;
use App\Services\Payment\PaymentService;

class ExtraChargeAppliedListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(protected PaymentService $paymentService)
    {
    }

    public function handle(ExtraChargeApplied $event): void
    {
        $order = $event->order;
        $requestData = $event->requestData;

//        $paymentService->add
    }
}
