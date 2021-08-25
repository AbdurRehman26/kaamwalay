<?php

namespace App\Services\Order\Shipping;

use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Models\Order;
use App\Models\OrderItemCustomerShipment;
use Illuminate\Support\Facades\Log;

class CustomerShipmentService
{
    public function process(Order $order, string $shippingProvider, string $trackingNumber): Order
    {
        try {
            $items = $order->orderItems;

            foreach ($items as $item) {
                $shipment = $item->orderItemCustomerShipment;

                if (! $shipment) {
                    $shipment = new OrderItemCustomerShipment();
                }
                $shipment->shipping_provider = $shippingProvider;
                $shipment->tracking_number = $trackingNumber;
                $shipment->save();

                if (! $item->order_item_customer_shipment_id) {
                    $item->order_item_customer_shipment_id = $shipment->id;
                    $item->save();
                }
            }

            return $order->fresh();
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            throw new CustomerShipmentNotUpdated;
        }
    }
}
