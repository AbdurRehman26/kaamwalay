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

    $this->assertInstanceOf(OrderItemCustomerShipment::class, $firstItem->orderItemCustomerShipment);
    $this->assertEquals($firstItem->orderItemCustomerShipment->shipping_provider, $shippingProvider);
    $this->assertEquals($firstItem->orderItemCustomerShipment->tracking_number, $trackingNumber);
});
