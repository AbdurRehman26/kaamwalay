<?php

use App\Models\CardProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderItemStatusHistory;
use App\Models\OrderStatus;
use App\Models\PaymentPlan;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->paymentPlan = PaymentPlan::factory()->create(['max_protection_amount' => 1000000]);
    $this->cardProduct = CardProduct::factory()->create();

    $this->order = Order::create([
        'payment_plan_id' => $this->paymentPlan->id,
        'user_id' => $this->user->id,
        'order_status_id' => OrderStatus::PAYMENT_PENDING,
    ]);
    actingAs($this->user);
});

test('customer can get list of order items', function () {
    OrderItem::create([
        'order_id' => $this->order->id,
        'card_product_id' => $this->cardProduct->id,
        'quantity' => 1,
        'declared_value_per_unit' => 10,
        'declared_value_total' => 10,
    ]);
    getJson(route('v2.orders.orderItems.index', ['order' => $this->order]))
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

test('customer can add items in order', function () {
    postJson(
        route('v2.orders.orderItems.store', ['order' => $this->order]),
        [
            'card_product_id' => $this->cardProduct->id,
            'quantity' => 1,
            'declared_value_per_unit' => 10,
        ]
    )
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

test('customer can update item in order', function () {
    $orderItem = OrderItem::create([
        'order_id' => $this->order->id,
        'card_product_id' => $this->cardProduct->id,
        'quantity' => 1,
        'declared_value_per_unit' => 10,
        'declared_value_total' => 10,
    ]);
    putJson(
        route('v2.orders.orderItems.update', ['order' => $this->order, 'orderItem' => $orderItem]),
        [
            'card_product_id' => $this->cardProduct->id,
            'quantity' => 2,
            'declared_value_per_unit' => 5,
        ]
    )
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonFragment([
            'declared_value_per_unit' => 5,
        ]);
});

test('customer can delete item in order', function () {
    $orderItem = OrderItem::create([
        'order_id' => $this->order->id,
        'card_product_id' => $this->cardProduct->id,
        'quantity' => 1,
        'declared_value_per_unit' => 10,
        'declared_value_total' => 10,
    ]);
    OrderItemStatusHistory::factory()->count(2)->create(['order_item_id' => $orderItem->id]);
    deleteJson(
        route('v2.orders.orderItems.destroy', ['order' => $this->order, 'orderItem' => $orderItem])
    )
        ->assertOk()
        ->assertJsonCount(0, 'data');
});

test('customer can not add items to orders other than incomplete', function () {
    $this->order->update(['order_status_id' => OrderStatus::PLACED]);

    postJson(
        route('v2.orders.orderItems.store', ['order' => $this->order]),
        [
            'card_product_id' => $this->cardProduct->id,
            'quantity' => 1,
            'declared_value_per_unit' => 10,
        ]
    )->assertForbidden();
});

test('customer can not update item to orders other than incomplete', function () {
    $this->order->update(['order_status_id' => OrderStatus::PLACED]);

    $orderItem = OrderItem::create([
        'order_id' => $this->order->id,
        'card_product_id' => $this->cardProduct->id,
        'quantity' => 1,
        'declared_value_per_unit' => 10,
        'declared_value_total' => 10,
    ]);
    putJson(
        route('v2.orders.orderItems.update', ['order' => $this->order, 'orderItem' => $orderItem]),
        [
            'card_product_id' => $this->cardProduct->id,
            'quantity' => 2,
            'declared_value_per_unit' => 5,
        ]
    )->assertForbidden();
});

test('customer can not delete item in order when its paid', function () {
    $this->order->update(['order_status_id' => OrderStatus::PLACED]);

    $orderItem = OrderItem::create([
        'order_id' => $this->order->id,
        'card_product_id' => $this->cardProduct->id,
        'quantity' => 1,
        'declared_value_per_unit' => 10,
        'declared_value_total' => 10,
    ]);
    deleteJson(
        route('v2.orders.orderItems.destroy', ['order' => $this->order, 'orderItem' => $orderItem])
    )->assertForbidden();
});
