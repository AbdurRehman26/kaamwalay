<?php

namespace App\Listeners\API\Order\V2;

use App\Events\API\Customer\Order\ChangeShippingAddressEvent;
use App\Services\Payment\V3\InvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;
use Throwable;

class ChangeShippingAddressListener implements ShouldQueue
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
    public function handle(ChangeShippingAddressEvent $event): void
    {
        $this->invoiceService->saveInvoicePDF($event->order);
    }

    public function failed(ChangeShippingAddressEvent $event, Throwable $exception): void
    {
        Log::error($exception->getMessage(), [
            'Invoice generation failed. Order ID: ' => $event->order->id,
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
