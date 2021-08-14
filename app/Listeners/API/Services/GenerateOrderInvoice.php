<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Payment\InvoiceService;

class GenerateOrderInvoice
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

    public function handle(OrderPaid $event): void
    {
        $order = $event->order;
        
        (new InvoiceService())->saveInvoicePDF($order);
    }
}
