<?php

namespace App\Services;

use App\Http\APIClients\ShipStationClient;
use App\Models\Order;
use Carbon\Carbon;

class ShipStationService
{
    public function __construct(protected ShipStationClient $shipStationClient)
    {
    }

    public function createOrder(Order $order): void
    {
        $data = [
            'orderNumber' => $order->order_number,
            'customerUsername' => $order->user->getFullName(),
            'customerEmail' => $order->user->email,
            'orderDate' => Carbon::parse($order->created_at)->format('Y-m-d\TH:i:s.uP'),
            'orderStatus' => 'awaiting_shipment',
            'orderTotal' => $order->grand_total,
            'advancedOptions' => [
                'storeId' => config('services.shipstation.store_id'),
            ],
            'billTo' => [
                'name' => $order->shippingAddress->getFullName(),
                'street1' => $order->shippingAddress->address,
                'street2' => $order->shippingAddress->address_2,
                'city' => $order->shippingAddress->city,
                'state' => $order->shippingAddress->state,
                'postalCode' => $order->shippingAddress->zip,
                'country' => $order->shippingAddress->country->code,
                'phone' => $order->shippingAddress->phone,
            ],
            'shipTo' => [
                'name' => $order->shippingAddress->getFullName(),
                'street1' => $order->shippingAddress->address,
                'street2' => $order->shippingAddress->address_2,
                'city' => $order->shippingAddress->city,
                'state' => $order->shippingAddress->state,
                'postalCode' => $order->shippingAddress->zip,
                'country' => $order->shippingAddress->country->code,
                'phone' => $order->shippingAddress->phone,
            ],
        ];

        $this->shipStationClient->createOrder($data);
    }
}
