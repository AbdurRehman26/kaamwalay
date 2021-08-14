<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Payment\InvoiceService;

class GenerateOrderInvoice
{
    public function __construct(public InvoiceService $invoiceService)
    {
        //
    }

    public function handle(OrderPaid $event): void
    {
        $this->invoiceService->saveInvoicePDF($event->order);
    }
}
