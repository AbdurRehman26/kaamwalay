<?php

namespace App\Listeners\API\Admin\Order;

use App\Events\API\Admin\Order\ExtraChargeApplied;
use App\Models\Order;
use App\Services\Payment\PaymentService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

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
