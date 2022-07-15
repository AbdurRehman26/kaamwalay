<?php

namespace App\Http\APIClients;

use App\Models\Order;
use Carbon\Carbon;
use Exception;
use Http;
use Log;

class ShipStationClient {

    public function createOrder(Order $order): array {
        $data = [
            'orderNumber' => $order->order_number,
            'customerUsername' => $order->user->getFullName(),
            'customerEmail' => $order->user->email,
            'numberofCards' => $order->orderItems->count(),
            'orderDate' =>  Carbon::parse($order->created_at)->format('Y-m-d\TH:i:s.uP'),
            'orderStatus' => 'awaiting_payment',
            'advancedOptions' => [
                "storeId" => config('services.shipstation.store_id'),
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
            ]
        ];

        try {
            $response = Http::withBasicAuth(config('services.shipstation.api_key'), config('services.shipstation.api_secret'))->post(config('services.shipstation.base_url') . '/orders/createorder', $data);
            return $response->json();
        } catch (Exception $e) {
            report($e);
            Log::error('Error occur for Order Number: ' . $order->order_number);
            return [];
        }
    }
}
