<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatus;
use App\Models\OrderStatus;
use App\Models\UserCard;
use function Pest\Laravel\assertDatabaseCount;
use function Pest\Laravel\assertDatabaseHas;

beforeEach(function () {
    Storage::fake('s3');
    config(['services.ags.is_platform_enabled' => true]);
});

it('generates order label for specific order', function () {
    $order = Order::factory()->create(['order_status_id' => OrderStatus::GRADED]);

    $orderItems = OrderItem::factory()->for($order)->count(5)->create(['order_item_status_id' => OrderItemStatus::GRADED]);

    foreach ($orderItems as $orderItem) {
        UserCard::factory()->for($orderItem)->create();
    }

    $this->artisan('orders:generate-label '.$order->order_number)->assertExitCode(0);
    assertDatabaseHas('order_labels', ['order_id' => $order->id]);
    assertDatabaseCount('card_labels', count($orderItems));
});

it('generates order label for already graded orders', function () {
    $orders = Order::factory()->count(5)->create(['order_status_id' => OrderStatus::GRADED]);

    $orders->each(function (Order $order) {
        $orderItems = OrderItem::factory()->for($order)->count(5)->create(['order_item_status_id' => OrderItemStatus::GRADED]);
        foreach ($orderItems as $orderItem) {
            UserCard::factory()->for($orderItem)->create();
        }
    });

    $this->artisan('orders:generate-label')->assertExitCode(0);
    assertDatabaseHas('order_labels', ['order_id' => $orders->first()->id]);
    assertDatabaseCount('card_labels', OrderItem::count());
});
