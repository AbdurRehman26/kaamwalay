<?php

namespace App\Console\Commands\Orders;

use App\Exceptions\API\Admin\Order\OrderCanNotBeMarkedAsGraded;
use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Models\Order;
use App\Models\User;
use App\Services\Admin\Order\ShipmentService;
use App\Services\Order\Shipping\CustomerShipmentService;
use Exception;
use Illuminate\Console\Command;
use Throwable;

class MigrateShipmentsToNewSchema extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:migrate-shipments-to-new-schema';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'It migrates existing order shipments and order customer shipments to new schema.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @param  CustomerShipmentService  $customerShipmentService
     * @param  ShipmentService  $shipmentService
     * @return int
     */
    public function handle(CustomerShipmentService $customerShipmentService, ShipmentService $shipmentService): int
    {
        $this->info('Starting...');
        $this->newLine();

        $email = $this->ask('Your account email');
        $user = User::whereEmail($email)->first();
        auth()->login($user);

        try {
            $this->migrateCustomerShipments($customerShipmentService);
            $this->migrateAdminShipments($shipmentService);
        } catch (Exception|Throwable $e) {
            $this->info($e->getMessage());
        }

        $this->info('Finished.');

        return 0;
    }

    /**
     * @param  CustomerShipmentService  $customerShipmentService
     * @throws CustomerShipmentNotUpdated
     */
    protected function migrateCustomerShipments(CustomerShipmentService $customerShipmentService)
    {
        $this->info('Processing Customer Shipments...');

        $orders = Order::placed()->where('order_customer_shipment_id', null)->get();

        $orders->each(function (Order $order) use ($customerShipmentService) {
            $orderItem = $order->orderItems()->where('order_item_customer_shipment_id', '!=', null)->first();
            if (! empty($orderItem)) {
                $this->info('Processing Order: ' . $order->id);
                $orderItemCustomerShipment = $orderItem->orderItemCustomerShipment;
                $customerShipmentService->process($orderItem->order, $orderItemCustomerShipment->shipping_provider, $orderItemCustomerShipment->tracking_number);

                $this->info('Order customer shipment created.');
                $this->newLine();
            }
        });

        $this->info('Processed Customer Shipments.');
        $this->newLine();
    }

    /**
     * @param  ShipmentService  $shipmentService
     * @throws OrderCanNotBeMarkedAsGraded
     * @throws Throwable
     */
    protected function migrateAdminShipments(ShipmentService $shipmentService)
    {
        $this->info('Processing Admin Shipments...');

        $orders = Order::placed()->where('order_shipment_id', null)->get();

        $orders->each(function (Order $order) use ($shipmentService) {
            $orderItem = $order->orderItems()->where('order_item_shipment_id', '!=', null)->first();

            if (! empty($orderItem)) {
                $this->info('Processing Order: ' . $order->id);
                $orderItemShipment = $orderItem->orderItemShipment;
                $shipmentService->updateShipment($orderItem->order, $orderItemShipment->shipping_provider, $orderItemShipment->tracking_number);

                $this->info('Order admin shipment created.');
                $this->newLine();
            }
        });

        $this->info('Processed Admin Shipments.');
        $this->newLine();
    }
}
