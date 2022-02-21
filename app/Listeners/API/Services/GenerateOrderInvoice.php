<?php

namespace App\Listeners\API\Services;

use App\Events\API\Customer\Order\OrderPaid;
use App\Services\Payment\V1\InvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class GenerateOrderInvoice implements ShouldQueue
{
    use InteractsWithQueue;

    public $tries = 5;

    public function __construct(public InvoiceService $invoiceService)
    {
        //
    }

    public function handle(OrderPaid $event): void
    {
        $this->invoiceService->saveInvoicePDF($event->order);
    }

    public function failed(OrderPaid $event, $exception)
    {
        Log::error($exception->getMessage(), [
            'Invoice generation failed. Order ID: ' => $event->order->id,
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
