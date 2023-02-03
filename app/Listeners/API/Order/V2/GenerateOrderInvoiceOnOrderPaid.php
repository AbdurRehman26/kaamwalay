<?php

namespace App\Listeners\API\Order\V2;

use App\Events\API\Customer\Order\OrderPaid;
use App\Exceptions\Services\Payment\InvoiceNotUploaded;
use App\Services\Payment\V2\InvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class GenerateOrderInvoiceOnOrderPaid implements ShouldQueue
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
    public function handle(OrderPaid $event): void
    {
        $order = $event->order;

        if ($order->hasInvoice()) {
            $order->invoice()->delete();
        }

        $this->invoiceService->saveInvoicePDF($order);
    }


    /**
     * @param  OrderPaid  $event
     * @param \Throwable $exception
     * @return void
     */
    public function failed(OrderPaid $event, $exception): void
    {
        Log::error($exception->getMessage(), [
            'Invoice generation failed. Order ID: ' => $event->order->id,
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
