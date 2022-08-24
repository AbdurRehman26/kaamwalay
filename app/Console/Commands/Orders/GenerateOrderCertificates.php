<?php

namespace App\Console\Commands\Orders;

use App\Models\Order;
use App\Models\OrderStatus;
use App\Services\Admin\Order\OrderCertificateService;
use Illuminate\Console\Command;

class GenerateOrderCertificates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:generate-certificates-export {orderNumber? : RG000000001}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate order certificates export for already confirmed orders';

    public function handle(OrderCertificateService $orderCertificateService): int
    {
        $ordersQuery = Order::excludeCancelled()->where('order_status_id', '>=', OrderStatus::CONFIRMED);
        $orderNumber = $this->argument('orderNumber');

        $ordersQuery->when($orderNumber, function ($query) use ($orderNumber){
            $query->where('order_number', $orderNumber);
        });

        $ordersQuery->when(!$orderNumber, function ($query) use ($orderNumber){
            $query->doesntHave('orderCertificate');
        });

        $orders = $ordersQuery->get();
        $this->info("Total {$orders->count()} orders found");

        $orders->each(function (Order $order) use ($orderCertificateService) {
            $this->info("Generating certificates export for order # {$order->order_number} ...");
            $orderCertificateService->generateCertificateExport($order);
            $this->info('Certificates export has been generated.');
        });

        return 0;
    }
}
