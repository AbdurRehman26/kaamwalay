<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Payment\InvoiceService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class GenerateOrderInvoice implements ShouldQueue
{
    public function __construct(public InvoiceService $invoiceService)
    {
        //
    }

    public function handle(OrderPaid $event): void
    {
        try {
            $this->invoiceService->saveInvoicePDF($event->order);
        } catch (Exception $e) {
            Log::error($e->getMessage(), [
                'Order ID' => $event->order->id,
            ]);
        }
    }
}
