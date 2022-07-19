<?php

use App\Http\APIClients\ShipStationClient;
use App\Models\Order;
use App\Models\ShippingMethod;

it('creates order on shipstation', function () {
    $order = Order::factory()->create();

    $data = [
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
        'https://ssapi.shipstation.com/*' => Http::response($data),
    ]);

    $response = resolve(ShipStationClient::class)->createOrder($order);

    expect($response)->toBe($response);
});

it('does not create order on shipstation when order is for vault', function () {
    $vaultShippingMethod = ShippingMethod::factory()->vault()->create();

    $order = Order::factory()->create([
        'shipping_method_id' => $vaultShippingMethod->id,
        'shipping_order_address_id' => null,
        'billing_order_address_id' => null,
    ]);

    $data = [
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
        'https://ssapi.shipstation.com/*' => Http::response($data),
    ]);

    $response = resolve(ShipStationClient::class)->createOrder($order);

    expect($response)->toBe([]);
});