<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\OrderCustomerShipment;
use App\Services\Order\Shipping\CustomerShipmentService;
use Illuminate\Console\Command;

class GenerateTrackingUrl extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order-customer-shipment-:generate-tracking-url';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Its generates missing tracking url for the order customer shipments';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $customerShipmentService = new CustomerShipmentService();
        $orders = Order::whereShippingMethodId(1)->whereNotNull('order_customer_shipment_id')->get();

        foreach($orders as $order) {
            $orderCustomerShipment = OrderCustomerShipment::whereId($order->order_customer_shipment_id)->whereNull('tracking_url')->first();
            
            if ($orderCustomerShipment) {
                $customerShipmentService->process($order, $orderCustomerShipment->shipping_provider, $orderCustomerShipment->tracking_number);
            }
        }
        $this->info('Generated tracking url.');
    }
}
