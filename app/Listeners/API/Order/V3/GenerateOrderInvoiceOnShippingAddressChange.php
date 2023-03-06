<?php

namespace App\Listeners\API\Order\V3;

use App\Events\API\Customer\Order\OrderPaid;
use App\Events\API\Order\V3\OrderShippingAddressChangedEvent;
use App\Exceptions\Services\Payment\InvoiceNotUploaded;
use App\Services\Payment\V3\InvoiceService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Log;

class GenerateOrderInvoiceOnShippingAddressChange implements ShouldQueue
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
    public function handle(OrderShippingAddressChangedEvent $event): void
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
