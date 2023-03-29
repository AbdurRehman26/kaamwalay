<?php

namespace App\Console\Commands\Orders;

use App\Models\Order;
use App\Services\Order\Shipping\CustomerShipmentService;
use Illuminate\Console\Command;

class GenerateTrackingUrl extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:generate-tracking-url-for-customer-shipment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Its generates missing tracking url for the customer shipments';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $customerShipmentService = new CustomerShipmentService();
        $orders = Order::join('order_customer_shipments', 'order_customer_shipments.id', 'orders.order_customer_shipment_id')
            ->whereNull('order_customer_shipments.tracking_url')
            ->whereIn('order_customer_shipments.shipping_provider', ['usps', 'ups', 'fedex', 'dhlexpress'])
            ->get();

        if ($orders->count() > 0) {
            foreach ($orders as $order) {
                $this->info("Generating tracking url for order# $order->order_number");
                try {
                    // @phpstan-ignore-next-line
                    $customerShipmentService->process($order, $order->shipping_provider, $order->tracking_number);
                } catch (\Exception $e) {
                    $this->info("Error occured on order# $order->order_number \n {$e->getMessage()}");
                }
            }
            $this->info('Generated tracking urls.');
        } else {
            $this->info('Tracking urls for all orders were already generated.');
        }
    }
}
