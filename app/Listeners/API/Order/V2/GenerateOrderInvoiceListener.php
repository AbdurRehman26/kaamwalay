<?php

namespace App\Listeners\API\Order\V2;

use App\Events\API\Order\V2\GenerateOrderInvoice;
use App\Exceptions\Services\Payment\InvoiceNotUploaded;
use App\Services\Payment\V2\InvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class GenerateOrderInvoiceListener implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 5;

    public function __construct(public InvoiceService $invoiceService)
    {
        //
    }

    /**
     * @throws InvoiceNotUploaded
     */
    public function handle(GenerateOrderInvoice $event)
    {
        $order = $event->order;

        if ($order->hasInvoice()) {
            $order->invoice()->delete();
        }

        $this->invoiceService->saveInvoicePDF($order);
    }
}
