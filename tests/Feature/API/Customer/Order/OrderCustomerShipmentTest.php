<?php

namespace Tests\Feature\API\Customer\Order\Shipping;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemCustomerShipment;
use App\Services\Order\Shipping\CustomerShipmentService;

class OrderCustomerShipmentTest extends TestCase
{
    use RefreshDatabase;

    protected string $shipmentProvider;
    protected string $trackingNumber;
    protected OrderItem $orderItem;
    protected Order $order;

    protected function setUp(): void
    {
        parent::setUp();
        $this->shipmentProvider = 'fedex';
        $this->trackingNumber = '020207021381215';

        $this->orderItem = OrderItem::factory()->create();
        $this->order = $this->orderItem->order;
    }

    /** @test */
    public function a_customer_can_update_order_shipment_details()
    {

        $this->actingAs($this->order->user);

        $response = $this->putJson('/api/customer/orders/'.$this->order->id.'/customer-shipment',[
            'shipment_provider' => $this->shipmentProvider,
            'tracking_number' => $this->trackingNumber,
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => ['customer_shipment' => ['tracking_number','shipment_provider']],
        ]);

    }

    /** @test */
    public function a_guest_cannot_update_order_shipment_details()
    {
        $response = $this->putJson('/api/customer/orders/'.$this->order->id.'/customer-shipment',[
            'shipment_provider' => $this->shipmentProvider,
            'tracking_number' => $this->trackingNumber,
        ]);

        $response->assertUnauthorized();
    }

    /** @test */
    public function a_customer_cannot_update_order_shipment_details_from_other_user()
    {
        $otherCustomer = User::factory()->create();

        $this->actingAs($otherCustomer);

        $response = $this->putJson('/api/customer/orders/'.$this->order->id.'/customer-shipment',[
            'shipment_provider' => $this->shipmentProvider,
            'tracking_number' => $this->trackingNumber,
        ]);

        $response->assertForbidden();
    }
}
