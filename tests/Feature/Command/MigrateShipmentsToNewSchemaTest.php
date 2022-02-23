<?php

use App\Events\API\Order\OrderStatusChangedEvent;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemCustomerShipment;
use App\Models\OrderItemShipment;
use App\Models\OrderStatus;
use App\Models\User;
use App\Services\Admin\V2\OrderStatusHistoryService;
use Illuminate\Support\Facades\Event;

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
