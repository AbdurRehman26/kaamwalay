<?php

namespace App\Services\Order\Shipping;

use App\Exceptions\API\Customer\Order\CustomerShipmentNotUpdated;
use App\Models\CustomerAddress;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderCustomerShipment;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class CustomerShipmentService
{
    public function process(Order $order, string $shippingProvider, string $trackingNumber): Order
    {
        try {
            $orderCustomerShipment = $order->orderCustomerShipment;

            if ($orderCustomerShipment) {
                $orderCustomerShipment->update([
                    'shipping_provider' => $shippingProvider,
                    'tracking_number' => $trackingNumber,
                ]);
            } else {
                $orderCustomerShipment = OrderCustomerShipment::create([
                    'shipping_provider' => $shippingProvider,
                    'tracking_number' => $trackingNumber,
                ]);

                $order->orderCustomerShipment()->associate($orderCustomerShipment)->save();
            }

            return $order->refresh();
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            throw new CustomerShipmentNotUpdated;
        }
    }
}
