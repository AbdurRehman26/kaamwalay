<?php

namespace Tests\Unit\API\Services\Order\Shipping;

use App\Models\OrderItem;
use App\Models\OrderItemCustomerShipment;
use App\Services\Order\Shipping\CustomerShipmentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerShipmentServiceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_update_order_shipment_details()
    {
        $shipmentProvider = 'fedex';
        $trackingNumber = '020207021381215';

        $orderItem = OrderItem::factory()->create();
        $order = $orderItem->order;

        $order = (new CustomerShipmentService)->process($order, $shipmentProvider, $trackingNumber);
        $firstItem = $order->orderItems[0];

        $this->assertInstanceOf(OrderItemCustomerShipment::class, $firstItem->orderItemCustomerShipment);
        $this->assertEquals($firstItem->orderItemCustomerShipment->shipment_provider, $shipmentProvider);
        $this->assertEquals($firstItem->orderItemCustomerShipment->tracking_number, $trackingNumber);
    }
}
