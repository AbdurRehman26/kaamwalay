<?php

namespace App\Console\Commands\Orders;

use App\Models\Invoice;
use App\Models\Order;
use App\Services\Payment\InvoiceService;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RegenerateOrderInvoice extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoice:regenerate {orderNumber : RG000000001}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Regenerate invoice/packing slip for specified order';

    /**
     * Execute the console command.
     *
     * @param  InvoiceService  $invoiceService
     * @return int
     * @throws \App\Exceptions\Services\Payment\InvoiceNotUploaded
     */
    public function handle(InvoiceService $invoiceService): int
    {
        $orderNumber = $this->argument('orderNumber');
        $this->info('Regenerating invoice for order # ' . $orderNumber);

        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        try {
            Invoice::findOrFail($order->invoice_id)->delete();
        } catch (ModelNotFoundException) {
            $this->info('Invoice does not exist already, could not delete.');
        }

        $invoiceService->saveInvoicePDF($order);

        $this->info('Invoice regenerated successfully.');
        $order->refresh();
        $this->info($order->invoice->path);

        return 0;
    }
}
