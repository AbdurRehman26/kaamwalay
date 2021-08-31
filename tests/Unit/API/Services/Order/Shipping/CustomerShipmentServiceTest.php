<?php

use App\Models\OrderItem;
use App\Models\OrderItemCustomerShipment;
use App\Services\Order\Shipping\CustomerShipmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class);
uses(RefreshDatabase::class);

it('can update order shipment details', function () {
    $shippingProvider = 'fedex';
    $trackingNumber = '020207021381215';

    $orderItem = OrderItem::factory()->create();
    $order = $orderItem->order;

    $order = (new CustomerShipmentService)->process($order, $shippingProvider, $trackingNumber);
    $firstItem = $order->orderItems[0];

    expect($firstItem->orderItemCustomerShipment)->toBeInstanceOf(OrderItemCustomerShipment::class);
    expect($shippingProvider)->toEqual($firstItem->orderItemCustomerShipment->shipping_provider);
    expect($trackingNumber)->toEqual($firstItem->orderItemCustomerShipment->tracking_number);
});
