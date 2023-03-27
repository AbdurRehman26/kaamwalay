<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Exceptions\Services\Payment\InvoiceNotUploaded;
use App\Models\Order;
use App\Services\Payment\V3\InvoiceService;
use Log;
use Throwable;

class GenerateOrderInvoiceOnShippingAddressChange
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public int $tries = 5;

    public function __construct(protected Order $order)
    {
        //
    }

    /**
     * @throws InvoiceNotUploaded
     */
    public function handle(InvoiceService $invoiceService): void
    {

        if ($this->order->hasInvoice()) {
            $this->order->invoice()->delete();
        }

        $invoiceService->saveInvoicePDF($this->order);
    }


    public function failed(Throwable $exception): void
    {
        Log::error($exception->getMessage(), [
            'Invoice generation failed. Order ID: ' => $this->order->id,
            'trace' => $exception->getTraceAsString(),
        ]);
    }
}
