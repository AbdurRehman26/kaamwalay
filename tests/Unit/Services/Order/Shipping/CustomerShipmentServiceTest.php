<?php

use App\Models\OrderCustomerShipment;
use App\Models\OrderItem;
use App\Services\Order\Shipping\CustomerShipmentService;

it('can update order shipment details', function () {
    $shippingProvider = 'fedex';
    $trackingNumber = '020207021381215';

    $orderItem = OrderItem::factory()->create();
    $order = $orderItem->order;

    $order = (new CustomerShipmentService)->process($order, $shippingProvider, $trackingNumber);

    expect($order->orderCustomerShipment)->toBeInstanceOf(OrderCustomerShipment::class);
    expect($shippingProvider)->toEqual($order->orderCustomerShipment->shipping_provider);
    expect($trackingNumber)->toEqual($order->orderCustomerShipment->tracking_number);
});
