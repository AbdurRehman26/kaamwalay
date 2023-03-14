<?php

namespace App\Listeners\API\Order\V2;

use App\Events\API\Customer\Order\OrderPlaced;
use App\Exceptions\Services\Payment\InvoiceNotUploaded;
use App\Services\Payment\V2\InvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;
use Throwable;

class GenerateOrderInvoiceOnOrderPlaced implements ShouldQueue
{
    use InteractsWithQueue;

    public int $tries = 5;

    public function __construct(public InvoiceService $invoiceService)
    {
        //
    }

    /**
     * @throws InvoiceNotUploaded
     */
    public function handle(OrderPlaced $event): void
    {
        $this->invoiceService->saveInvoicePDF($event->order);
    }

    public function failed(OrderPlaced $event, Throwable $exception): void
    {
        Log::error($exception->getMessage(), [
            'Invoice generation failed. Order ID: ' => $event->order->id,
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
