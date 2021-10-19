<?php

use App\Events\API\Order\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemCustomerShipment;
use App\Models\OrderItemShipment;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\OrderStatusHistoryService;
use Illuminate\Support\Facades\Event;

use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    Event::fake([
        OrderStatusChangedEvent::class,
    ]);
    $this->user = User::factory()->create();

    $this->order = Order::factory()->create([
        'order_customer_shipment_id' => null,
        'order_shipment_id' => null,
        'order_status_id' => OrderStatus::PLACED,
    ]);
    resolve(OrderStatusHistoryService::class)->addStatusToOrder(OrderStatus::PLACED, $this->order, $this->user->id);

    $this->orderItemCustomerShipment = OrderItemCustomerShipment::factory()
        ->create([
            'tracking_number' => 'customer_123',
            'shipping_provider' => 'customer_usps',
        ]);
    $this->orderItemShipment = OrderItemShipment::factory()
        ->create([
            'tracking_number' => 'admin_123',
            'shipping_provider' => 'admin_usps',
        ]);
    OrderItem::factory()
        ->for($this->order)
        ->count(2)
        ->create([
            'order_item_customer_shipment_id' => $this->orderItemCustomerShipment->id,
            'order_item_shipment_id' => $this->orderItemShipment->id,
        ]);
});

it('migrates existing customer shipments to new schema', function () {
    $this->artisan('orders:migrate-shipments-to-new-schema')
        ->expectsQuestion('Your account email', $this->user->email)
        ->assertExitCode(0);

    $this->order->refresh();

    assertDatabaseCount('order_customer_shipments', 1);
    assertDatabaseHas('order_customer_shipments', [
        'tracking_number' => $this->orderItemCustomerShipment->tracking_number,
        'shipping_provider' => $this->orderItemCustomerShipment->shipping_provider,
    ]);

    expect($this->order->order_customer_shipment_id)->not()->toBeNull();
});

it('migrates existing admin shipments to new schema', function () {
    $this->artisan('orders:migrate-shipments-to-new-schema')
        ->expectsQuestion('Your account email', $this->user->email)
        ->assertExitCode(0);

    $this->order->refresh();

    assertDatabaseCount('order_shipments', 1);
    assertDatabaseHas('order_shipments', [
        'tracking_number' => $this->orderItemShipment->tracking_number,
        'shipping_provider' => $this->orderItemShipment->shipping_provider,
    ]);

    expect($this->order->order_shipment_id)->not()->toBeNull();
});
