<?php

use App\Http\APIClients\ShipStationClient;
use App\Models\Order;
use Carbon\Carbon;

it('creates order on shipstation', function () {
    $order = Order::factory()->create();

    $requestData = [
        'orderNumber' => $order->order_number,
        'customerUsername' => $order->user->getFullName(),
        'customerEmail' => $order->user->email,
        'orderDate' => Carbon::parse($order->created_at)->format('Y-m-d\TH:i:s.uP'),
        'orderStatus' => 'awaiting_payment',
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

    $responseData = [
        'orderId' => 107823681,
        'orderNumber' => 'RG000000104',
        'orderKey' => 'd5b5dbf09f224ba8884214bd845f825f',
        'orderDate' => '2022-07-14T20:57:00.0000000',
        'createDate' => '2022-07-14T20:57:10.2670000',
        'modifyDate' => '2022-07-14T20:57:10.1730000',
        'paymentDate' => null,
        'shipByDate' => null,
        'orderStatus' => 'awaiting_payment',
        'customerEmail' => 'test@test.com',
        'billTo' => [],
        'shipTo' => [],
        'items' => [],
        'weight' => [],
        'insuranceOptions' => [],
        'internationalOptions' => [],
    ];

    Http::fake([
        'https://ssapi.shipstation.com/*' => Http::response($responseData),
    ]);

    $response = resolve(ShipStationClient::class)->createOrder($requestData);

    expect($response)->toBe($response);
});
