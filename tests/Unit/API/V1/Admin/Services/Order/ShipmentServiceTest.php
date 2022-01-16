<?php

use App\Models\OrderItem;
use App\Models\OrderShipment;
use App\Models\User;
use App\Services\Admin\Order\ShipmentService;

it('can update order shipment details', function () {
    Event::fake();

    /** @var User $user */
    $user = User::factory()->withRole(config('permission.roles.admin'))->create();
    $this->actingAs($user);

    $shippingProvider = 'fedex';
    $trackingNumber = '020207021381215';

    $orderItem = OrderItem::factory()->create();
    $order = $orderItem->order;

    resolve(ShipmentService::class)->updateShipment($order, $shippingProvider, $trackingNumber);

    expect($order->orderShipment)->toBeInstanceOf(OrderShipment::class);
    expect($shippingProvider)->toEqual($order->orderShipment->shipping_provider);
    expect($trackingNumber)->toEqual($order->orderShipment->tracking_number);
});
